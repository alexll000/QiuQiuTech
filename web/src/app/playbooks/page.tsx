import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { FilterChips } from "@/components/platform-ui";
import { listPlaybookFeed } from "@/lib/content-service";
import { playbookFilters } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "玩法拆解",
  description: "浏览 QiuQiuTech 的玩法拆解、渠道打法、内容形式、话题机制与用户增长创意。",
  path: "/playbooks",
  keywords: ["玩法拆解", "渠道打法", "内容形式", "话题机制", "用户增长创意"],
});

export default async function PlaybooksPage() {
  const playbooks = await listPlaybookFeed();

  return (
    <SiteShell activePath="/playbooks">
      <section className="rounded-[34px] border border-border bg-white px-6 py-7 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.6rem] sm:leading-[1.04]">
              玩法拆解
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-copy-soft sm:text-lg">
              渠道打法、内容形式、话题机制与增长创意，应该沉淀成可被反复回看的方法论资产。
            </p>
            <div className="mt-8 rounded-full border border-border bg-[#fcfdff] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <FilterChips items={playbookFilters} />
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["适用行业", "消费、美妆、科技、生活方式"],
              ["使用场景", "新品上市、联名合作、节点营销"],
              ["阅读方式", "热门推荐、最新收录、专题推荐"],
            ].map(([title, note], index) => (
              <article
                key={title}
                className={`rounded-[26px] border px-5 py-5 ${
                  index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-[#fbfcff]"
                }`}
              >
                <p className="text-sm font-semibold text-navy-strong">{title}</p>
                <p className="mt-3 text-sm leading-7 text-copy-soft">{note}</p>
              </article>
            ))}
          </section>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {playbooks.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)]"
            >
              <article className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        index % 3 === 0
                          ? "bg-[#f4fbf8] text-teal"
                          : index % 3 === 1
                            ? "bg-[#f4f8ff] text-navy-strong"
                            : "bg-[#fff8e6] text-[#b4832a]"
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-sm text-copy-soft">{item.meta}</span>
                  </div>

                  <h2 className="mt-4 text-[2rem] font-semibold tracking-tight text-navy-strong group-hover:text-[#1d8eb6]">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-copy-soft">{item.description}</p>
                </div>

                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-[#fbfcff] px-3 py-1.5 text-sm font-medium text-copy-soft"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-copy-soft">适用行业：{item.fitFor}</span>
                    <span className="text-sm font-medium text-navy-strong">查看拆解</span>
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
