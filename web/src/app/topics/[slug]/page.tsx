import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { findTopicBySlug, listTopicFeed, listTopics } from "@/lib/content-service";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const items = await listTopics();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await findTopicBySlug(slug);

  if (!item) {
    return buildMetadata({ title: "专题不存在" });
  }

  return buildMetadata({
    title: item.title,
    description: item.intro,
    path: `/topics/${slug}`,
    keywords: [item.title, "营销专题", "专题策展", item.topicType || "行业专题"],
  });
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await findTopicBySlug(slug);
  const topics = await listTopicFeed();
  const topic = topics.find((entry) => entry.slug === slug);

  if (!item || !topic) notFound();

  return (
    <SiteShell activePath="/topics">
      <section className="rounded-[34px] border border-border bg-white px-6 py-7 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
              Topic Detail
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.3rem] sm:leading-[1.06]">
              {item.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-copy-soft">{item.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {topic.highlightTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-[#fbfcff] px-3 py-1.5 text-sm font-medium text-navy-strong"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["聚合内容", String(topic.contentCount)],
              ["合作信号", String(topic.requestCount)],
              ["更新状态", "持续更新"],
            ].map(([title, value], index) => (
              <article
                key={title}
                className={`rounded-[26px] border px-5 py-5 ${
                  index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-[#fbfcff]"
                }`}
              >
                <p className="text-sm font-semibold text-navy-strong">{title}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-navy-strong">{value}</p>
              </article>
            ))}
          </section>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.04fr_0.96fr]">
          <section className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">专题内精选内容</h2>
              <Link href="/contents" className="text-sm font-medium text-copy-soft hover:text-navy-strong">
                浏览全部内容
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {topic.featuredItems.map((entry, index) => (
                <Link
                  key={entry.title}
                  href={entry.href}
                  className={`block rounded-[24px] border px-4 py-4 ${
                    index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-[#fbfcff]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-navy-strong">{entry.title}</p>
                      <p className="mt-1 text-sm text-copy-soft">{entry.type}</p>
                    </div>
                    <span className="text-sm font-medium text-copy-soft">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
            <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">专题角色</h2>
            <div className="mt-5 space-y-3">
              {[
                ["内容聚合", "把案例、事件、玩法拆解放进同一个主题容器里。"],
                ["合作联动", "同主题下可直接承接相关合作需求与撮合机会。"],
                ["SEO 价值", "专题页天然适合作为可索引的长期内容资产。"],
              ].map(([title, body], index) => (
                <article
                  key={title}
                  className={`rounded-[24px] border px-4 py-4 ${
                    index === 1 ? "border-[#d8efe9] bg-[#f4fbf8]" : "border-border bg-[#fbfcff]"
                  }`}
                >
                  <p className="text-sm font-semibold text-navy-strong">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-copy-soft">{body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </SiteShell>
  );
}
