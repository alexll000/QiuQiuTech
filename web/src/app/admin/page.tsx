import { buildMetadata } from "@/lib/seo";
import { adminNavItems, adminOverview } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "后台运营台",
  description: "QiuQiuTech 后台用于处理内容审核、抓取导入、专题推荐、展示位管理与运营看板。",
  path: "/admin",
  noIndex: true,
  keywords: ["后台运营台", "投稿审核", "抓取导入", "展示位管理", "运营看板"],
});

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#eef3fb] text-copy">
      <div className="mx-auto max-w-[1460px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-border bg-white px-6 py-6 shadow-[0_18px_52px_rgba(22,43,117,0.06)] sm:px-8">
          <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr] xl:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copy-soft">
                Operations Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.2rem] sm:leading-[1.06]">
                后台把审核、发布、抓取、专题推荐与展示位管理收进同一套运营框架。
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-copy-soft">
                这里的重点不是堆复杂图表，而是让单人运营者一眼看清待审核内容、异常抓取、首页位占用与合作卡风险。
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["运行状态", "稳定"],
                ["待处理队列", "13"],
                ["今日发布", "08"],
              ].map(([label, value], index) => (
                <article
                  key={label}
                  className={`rounded-[24px] border px-4 py-4 ${
                    index === 0 ? "border-[#d8efe9] bg-[#f4fbf8]" : "border-border bg-[#fbfcff]"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-copy-soft">{label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-navy-strong">{value}</p>
                </article>
              ))}
            </div>
          </div>
        </header>

        <main className="mt-5 grid gap-5 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-[30px] border border-border bg-white p-6 shadow-[0_12px_34px_rgba(22,43,117,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
              Navigation
            </p>
            <div className="mt-6 space-y-3">
              {adminNavItems.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-[20px] px-4 py-4 text-sm font-medium ${
                    index === 0
                      ? "bg-navy-strong text-white shadow-[0_12px_24px_rgba(22,43,117,0.16)]"
                      : "border border-border bg-[#fbfcff] text-navy-strong"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-5">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {adminOverview.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[26px] border border-border bg-white p-5 shadow-[0_12px_32px_rgba(22,43,117,0.04)]"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-copy-soft">{item.label}</p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-navy-strong">{item.value}</p>
                  <p className="mt-3 text-sm leading-7 text-copy-soft">{item.note}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.04fr_0.96fr]">
              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_12px_34px_rgba(22,43,117,0.04)] sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
                      Review Queue
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-strong">
                      当前重点处理队列
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-xs font-medium text-navy-strong">
                    实时刷新
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ["投稿内容", "品牌节点 campaign 案例投稿，待审核素材与结构字段。", "待审核"],
                    ["抓取内容", "来源解析成功，但需要补齐品牌标签与摘要。", "待补全"],
                    ["合作卡", "品牌合作需求需确认身份与联系方式策略。", "需校验"],
                    ["专题配置", "首页专题位与专题详情页内容需要统一编排与排序。", "待发布"],
                  ].map(([title, description, status], index) => (
                    <article
                      key={title}
                      className={`rounded-[24px] border px-4 py-4 ${
                        index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-[#fbfcff]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-navy-strong">{title}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-copy-soft">
                          {status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-copy-soft">{description}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_12px_34px_rgba(22,43,117,0.04)] sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
                    Source Intake
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-strong">
                    抓取与导入状态
                  </h2>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ["链接抓取", "运营输入单条链接后，立即解析标题、摘要、正文与封面。", "可执行"],
                    ["定时抓取", "按来源站点、RSS 或 API 周期抓取，进入待审核池。", "运行中"],
                    ["结构补全", "为抓取内容补行业、标签、品牌与专题关联。", "人工确认"],
                  ].map(([title, note, status], index) => (
                    <article
                      key={title}
                      className={`rounded-[24px] border px-4 py-4 ${
                        index === 1 ? "border-[#d8efe9] bg-[#f4fbf8]" : "border-border bg-[#fbfcff]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-navy-strong">{title}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-copy-soft">
                          {status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-copy-soft">{note}</p>
                    </article>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_12px_34px_rgba(22,43,117,0.04)] sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
                      Placement Ops
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-strong">
                      首页与专题展示位
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#fff8e6] px-3 py-1 text-xs font-medium text-[#b4832a]">
                    需关注
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ["首页 Hero", "当前绑定精选案例主视觉"],
                    ["热点事件流", "按最新事件与热度展示"],
                    ["投稿精选位", "通过审核后分配曝光"],
                    ["专题推荐位", "按季度 / 节点 / 行业更新"],
                  ].map(([title, note]) => (
                    <div key={title} className="rounded-[22px] border border-border bg-[#fbfcff] px-4 py-4">
                      <p className="text-sm font-semibold text-navy-strong">{title}</p>
                      <p className="mt-2 text-sm leading-7 text-copy-soft">{note}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_12px_34px_rgba(22,43,117,0.04)] sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
                    Operator Notes
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-strong">
                    当前运营要求
                  </h2>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "审核流必须保留操作日志与驳回原因。",
                    "标签体系不能写死，展示位与前台聚合都依赖动态标签。",
                    "抓取内容必须保留来源标识，并允许运营补行业和专题归属。",
                    "合作卡在前台展示前，至少要校验身份与联系方式策略。",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-[22px] border px-4 py-4 text-sm leading-7 ${
                        index === 1 ? "border-[#d8efe9] bg-[#f4fbf8] text-teal" : "border-border bg-[#fbfcff] text-copy-soft"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
