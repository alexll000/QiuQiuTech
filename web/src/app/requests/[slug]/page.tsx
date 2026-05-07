import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { findRequestBySlug, listRequests } from "@/lib/content-service";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const items = await listRequests();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await findRequestBySlug(slug);

  if (!item) {
    return buildMetadata({ title: "合作需求不存在" });
  }

  return buildMetadata({
    title: item.title,
    description: item.summary,
    path: `/requests/${slug}`,
    keywords: [
      item.title,
      typeof item.industry === "string" ? item.industry : item.industry?.name,
      item.city,
      item.requestType,
    ].filter((value): value is string => Boolean(value)),
  });
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await findRequestBySlug(slug);

  if (!item) notFound();

  const contactMode =
    "contactMode" in item
      ? item.contactMode
      : item.contactPolicy || "apply_only";
  const detailDescription =
    "description" in item
      ? item.description
      : "合作需求详情页需要完整展示发布者身份、目标对象、联系方式策略、合作周期与可供匹配的合作方向。";
  const targetType =
    "targetType" in item ? item.targetType : "待在后台配置目标合作对象";
  const industryLabel =
    typeof item.industry === "string" ? item.industry : item.industry?.name || "未设置";
  const budgetLabel = "budget" in item ? item.budget : item.budgetRange || "待沟通";
  const cycleLabel = "cycle" in item ? item.cycle : "待沟通";
  const tags = Array.isArray(item.tags)
    ? item.tags.map((tag) => (typeof tag === "string" ? tag : tag.name))
    : [];

  return (
    <SiteShell activePath="/requests">
      <article className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-[32px] border border-border bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-copy-soft">
              {item.requestType}
            </span>
            <span className="rounded-full bg-[#fff7db] px-3 py-1 text-xs font-medium text-navy-strong">
              {contactMode}
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-navy-strong">
            {item.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-copy-soft">{item.summary}</p>
          {tags.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-[#fbfcff] px-3 py-1.5 text-sm font-medium text-navy-strong"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
          <p className="mt-8 text-base leading-8 text-copy">{detailDescription}</p>
        </section>

        <aside className="grid gap-4">
          <section className="rounded-[32px] border border-border bg-white p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-copy-soft">Request Info</p>
            <div className="mt-5 space-y-4">
              {[
                ["目标对象", targetType],
                ["行业", industryLabel],
                ["城市", item.city],
                ["预算范围", budgetLabel],
                ["周期", cycleLabel],
                ["联系方式模式", contactMode],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-border pb-4 last:border-b-0">
                  <p className="text-sm font-semibold text-navy-strong">{label}</p>
                  <p className="mt-2 text-sm leading-7 text-copy-soft">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-border bg-white p-6">
            <div className="rounded-full bg-navy-strong px-4 py-3 text-center text-sm font-medium text-white">
              申请合作
            </div>
            <div className="mt-3 rounded-full border border-border px-4 py-3 text-center text-sm font-medium text-navy-strong">
              相似需求推荐
            </div>
          </section>
        </aside>
      </article>
    </SiteShell>
  );
}
