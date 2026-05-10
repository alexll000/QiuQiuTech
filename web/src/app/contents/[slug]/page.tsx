import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/action-buttons";
import { SiteShell } from "@/components/site-shell";
import { findContentBySlug, listContents } from "@/lib/content-service";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const items = await listContents();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await findContentBySlug(slug);

  if (!item) {
    return buildMetadata({ title: "内容不存在" });
  }

  return buildMetadata({
    title: item.seoTitle || item.title,
    description: item.seoDescription || item.summary,
    path: `/contents/${slug}`,
    keywords: [
      item.title,
      item.brandName || "品牌营销",
      ...(item.tags || []).map((tag) => tag.name),
    ],
  });
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await findContentBySlug(slug);

  if (!item) notFound();

  const contentTypeLabel =
    item.contentType === "case"
      ? "案例"
      : item.contentType === "trend"
        ? "趋势观察"
        : item.contentType === "brand_news"
          ? "品牌动态"
          : item.contentType === "report"
            ? "报告解读"
            : "深度特辑";

  return (
    <SiteShell activePath="/contents">
      <article className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-border bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-copy-soft">
              {contentTypeLabel}
            </span>
            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-copy-soft">
              {item.sourceName || "QiuQiuTech"}
            </span>
            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-copy-soft">
              {item.brandName || "品牌内容"}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-navy-strong">
            {item.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-copy-soft">{item.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {(item.tags || []).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full border border-border bg-surface-muted px-4 py-2 text-sm font-medium text-navy-strong"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="mt-10 space-y-6">
            {(item.body || "").split("\n\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-base leading-8 text-copy">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <aside className="grid gap-4">
          <section className="rounded-[32px] border border-border bg-white p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-copy-soft">Structured Info</p>
            <div className="mt-5 space-y-4">
              {[
                ["内容类型", contentTypeLabel],
                ["来源站点", item.sourceName || "QiuQiuTech"],
                ["品牌", item.brandName || "未设置"],
                ["行业", item.industry?.name || "未设置"],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-border pb-4 last:border-b-0">
                  <p className="text-sm font-semibold text-navy-strong">{label}</p>
                  <p className="mt-2 text-sm leading-7 text-copy-soft">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-border bg-white p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-copy-soft">Actions</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <FavoriteButton
                targetType="content"
                targetId={item.slug}
                title={item.title}
                href={`/contents/${item.slug}`}
              />
              <span className="rounded-full border border-border px-4 py-2 text-sm font-medium text-navy-strong">
                分享
              </span>
              <Link
                href="/requests"
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-navy-strong"
              >
                查看合作 CTA
              </Link>
            </div>
          </section>
        </aside>
      </article>
    </SiteShell>
  );
}
