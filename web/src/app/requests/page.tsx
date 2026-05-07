import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { listRequests } from "@/lib/content-service";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "合作对接",
  description: "浏览 QiuQiuTech 的合作机会广场，按合作类型、领域、地区和发布时间筛选品牌与市场人的合作需求。",
  path: "/requests",
  keywords: ["合作机会", "品牌合作", "市场人对接", "合作广场", "品牌找营销人"],
});

const leftFilters = [
  {
    title: "合作类型",
    items: ["品牌找营销人", "品牌找品牌", "代理公司合作"],
  },
  {
    title: "合作领域",
    items: ["内容营销", "品牌合作", "社媒运营", "创意设计", "直播带货", "数据分析", "媒介投放", "公关传播"],
  },
];

const quickFields = [
  { title: "公司所在地区", value: "选择地区" },
  { title: "发布时间", value: "选择时间范围" },
];

const brandNames = ["花西子", "完美日记", "泡泡玛特", "元气森林", "三顿半", "ubras"];

export default async function RequestsPage() {
  const requests = await listRequests();

  return (
    <SiteShell activePath="/requests">
      <section className="rounded-[34px] border border-border bg-white shadow-[0_20px_56px_rgba(22,43,117,0.05)]">
        <div className="border-b border-border px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-7 text-sm font-medium text-copy-soft">
              {[
                { label: "合作机会", active: true },
                { label: "合作机构", active: false },
                { label: "成功案例", active: false },
                { label: "关于我们", active: false },
              ].map(({ label, active }) => (
                <span
                  key={label}
                  className={`relative pb-3 ${
                    active ? "font-semibold text-navy-strong after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-teal" : ""
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-navy-strong"
              >
                登录
              </Link>
              <Link
                href="/auth"
                className="rounded-full bg-navy-strong px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(22,43,117,0.18)]"
              >
                注册
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[300px_1fr]">
          <aside className="border-r border-border px-6 py-7 sm:px-8">
            <div className="space-y-7">
              {leftFilters.map((group, groupIndex) => (
                <section key={group.title} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[1.35rem] font-semibold tracking-tight text-navy-strong">
                      {group.title}
                    </h3>
                    {groupIndex > 0 ? <span className="text-lg text-copy-soft">⌄</span> : null}
                  </div>
                  <div className="space-y-3.5">
                    {group.items.map((item, index) => (
                      <label key={item} className="flex items-center gap-3 text-base text-copy">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                            groupIndex === 0 && index === 0
                              ? "border-transparent bg-teal text-white"
                              : "border-border bg-white"
                          }`}
                        >
                          {groupIndex === 0 && index === 0 ? "✓" : ""}
                        </span>
                        {item}
                      </label>
                    ))}
                  </div>
                </section>
              ))}

              {quickFields.map((field) => (
                <section key={field.title}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[1.35rem] font-semibold tracking-tight text-navy-strong">
                      {field.title}
                    </h3>
                    <span className="text-lg text-copy-soft">⌄</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[18px] border border-border bg-white px-4 py-3.5 text-sm text-copy-soft">
                    <span>{field.value}</span>
                    <span>⌄</span>
                  </div>
                </section>
              ))}
            </div>

            <button className="mt-8 flex items-center gap-3 text-base font-medium text-navy-strong">
              <span className="text-xl">↻</span>
              重置筛选
            </button>
          </aside>

          <div className="px-6 py-7 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.2rem]">
                  合作机会
                </h1>
                <p className="mt-3 text-base leading-8 text-copy-soft">
                  找到合适的合作伙伴，共同创造价值。
                </p>
                <p className="mt-4 text-base text-copy-soft">共 128 个合作机会</p>
              </div>

              <div className="flex items-center justify-between rounded-[18px] border border-border bg-white px-4 py-3 text-sm text-navy-strong min-w-[160px]">
                <span>最新发布</span>
                <span>⌄</span>
              </div>
            </div>

            <div className="mt-7 grid gap-5 xl:grid-cols-2">
              {requests.slice(0, 6).map((item, index) => (
                <article
                  key={item.slug}
                  className="rounded-[28px] border border-border bg-white p-5 shadow-[0_14px_36px_rgba(22,43,117,0.04)]"
                >
                  <div className="grid gap-5 sm:grid-cols-[126px_1fr_auto] sm:items-center">
                    <div className="flex h-[166px] items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#f8f9fc_0%,#eef2f8_100%)] text-copy-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <div className="text-center">
                        <div className="mx-auto h-12 w-14 rounded-[12px] border border-[#bfc9dd]" />
                        <p className="mt-3 text-2xl font-semibold tracking-tight text-copy-soft">
                          LOGO
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[1.85rem] font-semibold tracking-tight text-navy-strong">
                          {brandNames[index] || item.city || "品牌方"}
                        </p>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal text-xs text-white">
                          ✓
                        </span>
                      </div>
                      <h2 className="mt-2 text-[1.9rem] font-semibold tracking-tight leading-[1.18] text-navy-strong">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-copy-soft">{item.summary}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.tags?.length
                          ? item.tags.slice(0, 3).map((tag) => tag.name)
                          : [item.industry?.name, item.city, item.requestType].filter(Boolean)
                        ).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[linear-gradient(135deg,#21b0a9_0%,#1687cc_100%)] px-3 py-1.5 text-sm font-medium text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="mt-4 text-sm text-copy-soft">
                        发布时间：{item.publishedAt || `2026-05-0${index + 1}`}
                      </p>
                    </div>

                    <div className="self-end sm:self-center">
                      <Link
                        href={`/requests/${item.slug}`}
                        className="inline-flex rounded-[12px] bg-[#ffcb1e] px-5 py-3 text-base font-semibold text-navy-strong shadow-[0_12px_22px_rgba(255,203,30,0.18)]"
                      >
                        申请合作
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-5 text-base text-copy-soft">
              <span className="text-2xl">‹</span>
              {["1", "2", "3", "4", "...", "11"].map((item, index) => (
                <span
                  key={item}
                  className={`flex h-11 min-w-11 items-center justify-center rounded-[12px] px-4 ${
                    index === 0
                      ? "bg-navy-strong font-semibold text-white shadow-[0_10px_24px_rgba(22,43,117,0.18)]"
                      : "text-navy-strong"
                  }`}
                >
                  {item}
                </span>
              ))}
              <span className="text-2xl">›</span>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
