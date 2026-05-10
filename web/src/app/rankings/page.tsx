import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { listRankingFeed } from "@/lib/content-service";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "榜单趋势",
  description: "查看 QiuQiuTech 的热门品牌、精选内容、趋势关键词与合作信号，快速建立营销趋势判断。",
  path: "/rankings",
  keywords: ["榜单趋势", "热门品牌", "趋势关键词", "精选内容", "合作信号"],
});

export default async function RankingsPage() {
  const ranking = await listRankingFeed();

  return (
    <SiteShell activePath="/rankings">
      <section className="rounded-[34px] border border-border bg-white px-6 py-7 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.6rem] sm:leading-[1.04]">
              榜单趋势
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-copy-soft sm:text-lg">
              热门品牌、精选案例、趋势关键词与合作信号，在这一页集中形成可持续浏览的行业导航。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["热度逻辑", "内容热度、标签频次、合作需求信号"],
              ["时间窗口", "近 24 小时、近 7 天、近 30 天"],
              ["页面职责", "趋势发现、内容导航、合作预判"],
            ].map(([title, note], index) => (
              <article
                key={title}
                className={`rounded-[26px] border px-5 py-5 ${
                  index === 1 ? "border-[#d8efe9] bg-[#f4fbf8]" : "border-border bg-[#fbfcff]"
                }`}
              >
                <p className="text-sm font-semibold text-navy-strong">{title}</p>
                <p className="mt-3 text-sm leading-7 text-copy-soft">{note}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-5">
            <section className="rounded-[30px] border border-border bg-[linear-gradient(135deg,#0f245b_0%,#15357e_46%,#1ca0b0_100%)] p-6 text-white shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Hot Brands
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">热门品牌</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {ranking.hotBrands.map((brand, index) => (
                  <article key={brand} className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/58">TOP {index + 1}</p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{brand}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
              <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">趋势关键词</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {ranking.hotKeywords.map((keyword, index) => (
                  <span
                    key={keyword}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      index % 3 === 0
                        ? "bg-[#f4fbf8] text-teal"
                        : index % 3 === 1
                          ? "bg-[#f4f8ff] text-navy-strong"
                          : "bg-[#fff8e6] text-[#b4832a]"
                    }`}
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <section className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">精选内容</h2>
                <Link href="/contents" className="text-sm font-medium text-copy-soft hover:text-navy-strong">
                  查看更多
                </Link>
              </div>
              <div className="mt-5 space-y-3">
                {ranking.featuredContents.map((item, index) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`block rounded-[24px] border px-4 py-4 ${
                      index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-[#fbfcff]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-semibold text-navy-strong">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-navy-strong">{item.title}</p>
                        <p className="mt-1 text-sm text-copy-soft">{item.type}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">合作信号</h2>
                <Link href="/requests" className="text-sm font-medium text-copy-soft hover:text-navy-strong">
                  前往合作广场
                </Link>
              </div>
              <div className="mt-5 space-y-3">
                {ranking.collaborationSignals.map((item, index) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="block rounded-[24px] border border-border bg-[#fbfcff] px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-navy-strong">{item.title}</p>
                        <p className="mt-1 text-sm text-copy-soft">{item.city}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          index % 2 === 0 ? "bg-[#f4fbf8] text-teal" : "bg-[#f4f8ff] text-navy-strong"
                        }`}
                      >
                        活跃
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
