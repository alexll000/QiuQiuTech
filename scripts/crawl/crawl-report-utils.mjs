export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function round(value, digits = 1) {
  return Number(value.toFixed(digits));
}

export function scoreSubmissionQuality(submission = {}) {
  const title = typeof submission.title === "string" ? submission.title.trim() : "";
  const summary = typeof submission.summary === "string" ? submission.summary.trim() : "";
  const excerpt =
    typeof submission.body_excerpt === "string" ? submission.body_excerpt.trim() : "";
  const tags = Array.isArray(submission.tags)
    ? submission.tags.filter((tag) => typeof tag === "string" && tag.trim())
    : [];
  const coverImage = typeof submission.cover_image === "string" ? submission.cover_image.trim() : "";

  const signals = {
    title: title ? 25 : 0,
    summary: clamp(summary.length / 120, 0, 1) * 20,
    excerpt: clamp(excerpt.length / 600, 0, 1) * 30,
    tags: Math.min(tags.length, 4) * 5,
    coverImage: coverImage ? 5 : 0,
  };

  const score = round(
    signals.title + signals.summary + signals.excerpt + signals.tags + signals.coverImage,
  );

  const warnings = [];
  if (!title) warnings.push("missing_title");
  if (summary.length < 60) warnings.push("summary_too_short");
  if (excerpt.length < 180) warnings.push("excerpt_too_short");
  if (tags.length < 2) warnings.push("low_tag_coverage");
  if (!coverImage) warnings.push("missing_cover_image");

  return {
    score,
    grade: gradeFromScore(score),
    signals: {
      title: round(signals.title),
      summary: round(signals.summary),
      excerpt: round(signals.excerpt),
      tags: round(signals.tags),
      coverImage: round(signals.coverImage),
    },
    warnings,
  };
}

function gradeFromScore(score) {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "E";
}

function createEmptySourceHealth() {
  return {
    total: 0,
    success: 0,
    failed: 0,
    avgQualityScore: 0,
    minQualityScore: null,
    maxQualityScore: null,
    lastFetchedAt: null,
    lastErrorAt: null,
    urls: [],
    recentFailures: [],
  };
}

export function buildCrawlHealthReport(results = [], failures = []) {
  const sourceHealth = {};

  for (const item of results) {
    const sourceName = item?.source_name || "unknown";
    const health = (sourceHealth[sourceName] ??= createEmptySourceHealth());
    const score = Number(item?.quality?.score || 0);

    health.total += 1;
    health.success += 1;
    health.avgQualityScore += score;
    health.minQualityScore =
      health.minQualityScore === null ? score : Math.min(health.minQualityScore, score);
    health.maxQualityScore =
      health.maxQualityScore === null ? score : Math.max(health.maxQualityScore, score);
    health.lastFetchedAt = item?.fetched_at || health.lastFetchedAt;
    if (item?.source_url) {
      health.urls.push(item.source_url);
    }
  }

  for (const item of failures) {
    const sourceName = item?.source_name || "unknown";
    const health = (sourceHealth[sourceName] ??= createEmptySourceHealth());
    health.total += 1;
    health.failed += 1;
    health.lastErrorAt = item?.at || health.lastErrorAt;
    health.recentFailures.push({
      url: item?.source_url || "",
      message: item?.error || "unknown_error",
      at: item?.at || null,
    });
    if (item?.source_url) {
      health.urls.push(item.source_url);
    }
  }

  const sources = Object.entries(sourceHealth)
    .map(([sourceName, health]) => {
      const avgQualityScore = health.success
        ? round(health.avgQualityScore / health.success)
        : 0;
      const successRate = health.total
        ? round((health.success / health.total) * 100)
        : 0;

      return {
        sourceName,
        total: health.total,
        success: health.success,
        failed: health.failed,
        successRate,
        avgQualityScore,
        minQualityScore: health.minQualityScore,
        maxQualityScore: health.maxQualityScore,
        healthLevel: inferHealthLevel(successRate, avgQualityScore),
        lastFetchedAt: health.lastFetchedAt,
        lastErrorAt: health.lastErrorAt,
        urls: Array.from(new Set(health.urls)),
        recentFailures: health.recentFailures.slice(-5),
      };
    })
    .sort((a, b) => a.sourceName.localeCompare(b.sourceName, "zh-CN"));

  const total = results.length + failures.length;
  const avgQualityScore = results.length
    ? round(results.reduce((sum, item) => sum + Number(item?.quality?.score || 0), 0) / results.length)
    : 0;

  return {
    generatedAt: new Date().toISOString(),
    overview: {
      total,
      success: results.length,
      failed: failures.length,
      successRate: total ? round((results.length / total) * 100) : 0,
      avgQualityScore,
      sourceCount: sources.length,
    },
    failures: failures.map((item) => ({
      sourceName: item?.source_name || "unknown",
      sourceUrl: item?.source_url || "",
      error: item?.error || "unknown_error",
      at: item?.at || null,
    })),
    sources,
  };
}

function inferHealthLevel(successRate, avgQualityScore) {
  if (successRate >= 95 && avgQualityScore >= 75) return "healthy";
  if (successRate >= 75 && avgQualityScore >= 55) return "watch";
  return "risk";
}
