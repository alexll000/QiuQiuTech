import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { listTopicFeed } from "@/lib/content-service";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "专题策展",
  description: "浏览 QiuQiuTech 围绕节点、季度、行业与品牌组织的专题策展内容。",
  path: "/topics",
  keywords: ["专题策展", "营销专题", "节点营销专题", "行业专题", "季度盘点"],
});

export default async function TopicsPage() {
  const topics = await listTopicFeed();
  const lead = topics[0];

  return (
    <SiteShell activePath="/topics">
      <section className="rounded-[34px] border border-border bg-white px-6 py-7 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.6rem] sm:leading-[1.04]">
              专题策展
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-copy-soft sm:text-lg">
              专题不是内容分类的附属物，而是把内容、事件、玩法和合作机会打包成可被长期浏览的行业资产。
            </p>
          </div>

          <article className="rounded-[30px] border border-border bg-[linear-gradient(135deg,#0f245b_0%,#15357e_44%,#21b0a9_100%)] p-6 text-white shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)] sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Topic Spotlight
            </p>
            <h2 className="mt-4 text-[2.3rem] font-semibold tracking-tight leading-[1.08]">
              {lead?.title || "专题策展"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              {lead?.intro || "围绕同一主题聚合案例、事件、玩法与合作信号。"}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(lead?.highlightTags || []).map((tag) => (
                <span key={tag} className="rounded-full border border-white/12 bg-white/12 px-3 py-1.5 text-sm font-medium text-white">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["内容数", String(lead?.contentCount || 24)],
                ["合作卡", String(lead?.requestCount || 6)],
                ["更新状态", "持续更新"],
              ].map(([label, value]) => (
                <article key={label} className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/58">{label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</p>
                </article>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-3">
          {topics.map((topic, index) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group block rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)]"
            >
              <article className="flex h-full flex-col justify-between">
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      index === 0
                        ? "bg-[#f4f8ff] text-navy-strong"
                        : index === 1
                          ? "bg-[#f4fbf8] text-teal"
                          : "bg-[#fff8e6] text-[#b4832a]"
                    }`}
                  >
                    专题策展
                  </span>
                  <h2 className="mt-4 text-[2rem] font-semibold tracking-tight text-navy-strong group-hover:text-[#1d8eb6]">
                    {topic.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-copy-soft">{topic.intro}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {topic.highlightTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-[#fbfcff] px-3 py-1.5 text-sm font-medium text-copy-soft"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm text-copy-soft">
                    <span>{topic.contentCount} 条内容</span>
                    <span>{topic.requestCount} 个合作信号</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {topic.featuredItems.map((item) => (
                      <div key={item.title} className="flex items-center justify-between gap-3 rounded-[18px] bg-[#fbfcff] px-3 py-3">
                        <div>
                          <p className="text-sm font-medium text-navy-strong">{item.title}</p>
                          <p className="mt-1 text-xs text-copy-soft">{item.type}</p>
                        </div>
                        <span className="text-sm font-medium text-copy-soft">→</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
