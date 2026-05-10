import { getCrawlOpsSnapshot } from "@/lib/crawl-report-service";

function formatTime(value?: string | null) {
  if (!value) return "暂无";
  try {
    return new Date(value).toLocaleString("zh-CN", { hour12: false });
  } catch {
    return value;
  }
}

function healthTone(level: "healthy" | "watch" | "risk") {
  if (level === "healthy") {
    return {
      badge: "bg-[#f4fbf8] text-[#1b7f5f]",
      panel: "border-[#d8efe9] bg-[#f4fbf8]",
      label: "健康",
    };
  }
  if (level === "watch") {
    return {
      badge: "bg-[#fff8e6] text-[#b4832a]",
      panel: "border-[#f2e3b3] bg-[#fffaf0]",
      label: "观察",
    };
  }
  return {
    badge: "bg-[#fff4f4] text-[#a13a3a]",
    panel: "border-[#f1d6d6] bg-[#fff7f7]",
    label: "风险",
  };
}

export async function AdminCrawlOpsPanel() {
  const snapshot = await getCrawlOpsSnapshot();
  const batch = snapshot.batchReport;
  const importReport = snapshot.importReport;
  const topSources = batch?.sources.slice(0, 3) ?? [];
  const failures = batch?.failures.slice(0, 4) ?? [];
  const importFailures = importReport?.failures.slice(0, 4) ?? [];

  return (
    <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
            抓取导入
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-strong">
            抓取与导入状态
          </h2>
          <p className="mt-2 text-sm leading-7 text-copy-soft">
            后台直接消费最新批次报告，优先看来源健康度、质量均分与导入结果。
          </p>
        </div>
        <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-xs font-medium text-navy-strong">
          {batch ? "实时报告" : "等待报告"}
        </span>
      </div>

      {!batch ? (
        <div className="mt-6 rounded-[24px] border border-border bg-[#fbfcff] px-4 py-5 text-sm leading-7 text-copy-soft">
          当前还没有检测到 `_batch-report.json`。先执行抓取脚本，再回到后台查看来源健康度与导入摘要。
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["最新批次", formatTime(batch.generatedAt)],
              ["来源数", String(batch.overview.sourceCount)],
              ["成功率", `${batch.overview.successRate}%`],
              ["质量均分", String(batch.overview.avgQualityScore)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[22px] border border-border bg-[#fbfcff] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.14em] text-copy-soft">{label}</p>
                <p className="mt-3 text-lg font-semibold text-navy-strong">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-[24px] border border-border bg-[#fbfcff] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-navy-strong">抓取批次摘要</p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-copy-soft">
                  总数 {batch.overview.total}
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-copy-soft">
                成功 {batch.overview.success} / 失败 {batch.overview.failed}
              </p>
              <p className="mt-2 text-xs text-copy-soft">
                输出目录：{batch.batch?.outDir || "未记录"} · delayMs={batch.batch?.delayMs ?? "未记录"}
              </p>
            </div>

            <div className="rounded-[24px] border border-border bg-[#fbfcff] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-navy-strong">导入摘要</p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-copy-soft">
                  {importReport ? formatTime(importReport.generatedAt) : "暂无导入报告"}
                </span>
              </div>
              {importReport ? (
                <>
                  <p className="mt-2 text-sm leading-7 text-copy-soft">
                    导入 {importReport.overview.imported} / 跳过 {importReport.overview.skipped} / 失败{" "}
                    {importReport.overview.failed}
                  </p>
                  <p className="mt-2 text-xs text-copy-soft">
                    最近导入 ID：{importReport.importedIds.slice(0, 4).join(", ") || "暂无"}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm leading-7 text-copy-soft">
                  当前还没有检测到 `_import-report.json`，说明这批抓取还没执行导入或未输出导入摘要。
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {topSources.map((source) => {
              const tone = healthTone(source.healthLevel);
              return (
                <article key={source.sourceName} className={`rounded-[24px] border px-4 py-4 ${tone.panel}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-navy-strong">{source.sourceName}</p>
                      <p className="mt-1 text-xs text-copy-soft">
                        成功 {source.success}/{source.total} · 质量分 {source.avgQualityScore}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone.badge}`}>
                      {tone.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-copy-soft">
                    最近抓取：{formatTime(source.lastFetchedAt)} · 最近异常：{formatTime(source.lastErrorAt)}
                  </p>
                  <p className="mt-2 text-xs text-copy-soft">
                    {source.urls[0] || "未记录来源 URL"}
                  </p>
                </article>
              );
            })}

            {topSources.length === 0 ? (
              <article className="rounded-[24px] border border-border bg-[#fbfcff] px-4 py-4 text-sm text-copy-soft">
                当前批次没有来源明细。
              </article>
            ) : null}
          </div>

          <div className="mt-5 rounded-[24px] border border-border bg-[#fbfcff] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-navy-strong">人工复核提醒</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-copy-soft">
                {failures.length > 0 ? `${failures.length} 条异常` : "无异常"}
              </span>
            </div>
            {failures.length > 0 ? (
              <div className="mt-3 space-y-2">
                {failures.map((failure) => (
                  <div key={`${failure.sourceName}-${failure.at}`} className="rounded-[18px] bg-white px-3 py-3">
                    <p className="text-sm font-medium text-navy-strong">{failure.sourceName}</p>
                    <p className="mt-1 text-sm leading-6 text-copy-soft">{failure.error}</p>
                    <p className="mt-1 text-xs text-copy-soft">
                      {failure.sourceUrl || "未记录 URL"} · {formatTime(failure.at)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-7 text-copy-soft">
                当前批次没有抓取异常。人工复核时优先检查低质量分来源与未生成导入报告的批次。
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <article className="rounded-[24px] border border-border bg-[#fbfcff] px-4 py-4">
              <p className="text-sm font-semibold text-navy-strong">失败重试建议</p>
              <p className="mt-2 text-sm leading-7 text-copy-soft">
                当前面板还没有直接触发脚本的按钮，但已经把标准重试入口固定下来了。人工处理失败导入时，优先跑下面这条命令。
              </p>
              <pre className="mt-3 overflow-x-auto rounded-[18px] bg-white px-3 py-3 text-[12px] leading-6 text-copy-soft">
{`node scripts/import/retry-failed-imports.mjs --failLog=tmp/crawl-failures.json --sourceDir=tmp/crawl-sync --retryDir=tmp/crawl-retry`}
              </pre>
              <p className="mt-2 text-xs text-copy-soft">
                下一阶段会把这条能力接成后台动作按钮与任务状态回写。
              </p>
            </article>

            <article className="rounded-[24px] border border-border bg-[#fbfcff] px-4 py-4">
              <p className="text-sm font-semibold text-navy-strong">导入失败样本</p>
              {importFailures.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {importFailures.map((failure) => (
                    <div key={`${failure.file}-${failure.at}`} className="rounded-[18px] bg-white px-3 py-3">
                      <p className="text-sm font-medium text-navy-strong">{failure.file}</p>
                      <p className="mt-1 text-sm leading-6 text-copy-soft">
                        status {failure.status}
                      </p>
                      <p className="mt-1 text-xs text-copy-soft">{formatTime(failure.at)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-7 text-copy-soft">
                  当前没有导入失败样本。若后续出现失败，这里会优先展示最近的失败文件与状态码，方便人工决定是否重试。
                </p>
              )}
            </article>
          </div>
        </>
      )}
    </article>
  );
}
