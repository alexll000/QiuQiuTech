import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { FilterChips } from "@/components/platform-ui";
import { listEventFeed } from "@/lib/content-service";
import { eventFilters } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "营销事件",
  description: "追踪 QiuQiuTech 中正在发生的 Campaign、联名合作、节点营销、快闪活动与社媒热点。",
  path: "/events",
  keywords: ["营销事件", "Campaign", "品牌联名", "节点营销", "快闪活动", "社媒热点"],
});

export default async function EventsPage() {
  const events = await listEventFeed();
  const lead = events[0];

  return (
    <SiteShell activePath="/events">
      <section className="rounded-[34px] border border-border bg-white px-6 py-7 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.6rem] sm:leading-[1.04]">
              营销事件
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-copy-soft sm:text-lg">
              把正在发生的品牌动作、节点营销、联名合作和传播热点，组织成高频浏览的事件流。
            </p>

            <div className="mt-8 rounded-full border border-border bg-[#fcfdff] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <FilterChips items={eventFilters} />
            </div>
          </div>

          <article className="overflow-hidden rounded-[30px] border border-border bg-[linear-gradient(135deg,#0f245b_0%,#15357e_46%,#1ca0b0_100%)] p-6 text-white shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)] sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Event Spotlight
            </p>
            <h2 className="mt-4 text-[2.3rem] font-semibold tracking-tight leading-[1.08]">
              {lead?.title || "品牌热点正在持续升温"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              {lead?.description || "事件流会承接内容、专题与合作需求之间的联动关系。"}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(lead?.tags || []).map((tag) => (
                <span key={tag} className="rounded-full border border-white/12 bg-white/12 px-3 py-1.5 text-sm font-medium text-white">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["实时热度", lead?.score || "96"],
                ["事件类型", lead?.type || "Campaign"],
                ["内容联动", "已开启"],
              ].map(([label, value]) => (
                <article key={label} className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/58">{label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</p>
                </article>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            {events.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className={`block rounded-[28px] border p-5 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] ${
                  index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-white"
                }`}
              >
                <article className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#21b0a9_0%,#1a8fe8_100%)] text-lg font-semibold text-white shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)]">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-navy-strong">
                        {item.type}
                      </span>
                      <span className="text-xs text-copy-soft">{item.source}</span>
                    </div>
                    <h2 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-navy-strong">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-copy-soft">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[#fbfcff] px-3 py-1.5 text-sm font-medium text-copy-soft">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 md:flex-col md:items-end">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.14em] text-copy-soft">热度</p>
                      <p className="mt-2 text-[2rem] font-semibold tracking-tight text-teal">{item.score}</p>
                    </div>
                    <div className="flex items-end gap-1">
                      {[10, 13, 12, 18, 15, 22].map((height, barIndex) => (
                        <span
                          key={`${item.id}-${barIndex}`}
                          className="w-2 rounded-full bg-[linear-gradient(180deg,#a7e7e1_0%,#21b0a9_100%)]"
                          style={{ height }}
                        />
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            <section className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
              <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">事件处理流</h2>
              <div className="mt-6 space-y-3">
                {[
                  ["抓取入池", "抓取到的事件先补齐标题、摘要、来源、标签与发布时间。"],
                  ["审核发布", "审核通过后可进入首页事件位、专题位与榜单趋势位。"],
                  ["联动推荐", "同主题内容、玩法文章和合作需求自动关联。"],
                ].map(([title, body], index) => (
                  <article
                    key={title}
                    className={`rounded-[24px] border px-4 py-4 ${
                      index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-[#fbfcff]"
                    }`}
                  >
                    <p className="text-sm font-semibold text-navy-strong">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-copy-soft">{body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
              <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">当前观察重点</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {events.flatMap((item) => item.tags).slice(0, 8).map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      index % 3 === 0
                        ? "bg-[#f4fbf8] text-teal"
                        : index % 3 === 1
                          ? "bg-[#f4f8ff] text-navy-strong"
                          : "bg-[#fff8e6] text-[#b4832a]"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
