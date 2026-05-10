import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { buildMetadata } from "@/lib/seo";
import { getSubmissionCenterData } from "@/lib/workflow-service";
import { SubmissionDraftForm } from "@/components/submission-draft-form";

export const metadata = buildMetadata({
  title: "我要投稿",
  description: "加入 QiuQiuTech 创作者社区，提交案例、营销事件与玩法拆解，进入平台审核和联动曝光流程。",
  path: "/submit",
  keywords: ["我要投稿", "创作者社区", "案例投稿", "营销事件投稿", "玩法拆解投稿"],
});

function SubmitIcon({ type }: { type: string }) {
  if (type === "doc") {
    return (
      <div className="relative h-18 w-16 rounded-[18px] border-[4px] border-teal">
        <div className="absolute right-[-4px] top-[-4px] h-6 w-6 rounded-bl-[12px] border-b-[4px] border-l-[4px] border-teal bg-white" />
        <div className="absolute left-3 top-7 h-1.5 w-8 rounded-full bg-teal/80" />
        <div className="absolute left-3 top-11 h-1.5 w-7 rounded-full bg-teal/55" />
      </div>
    );
  }

  if (type === "horn") {
    return (
      <div className="relative h-16 w-18">
        <div className="absolute left-2 top-5 h-7 w-8 rounded-l-[14px] rounded-r-[8px] bg-teal" />
        <div className="absolute left-8 top-2 h-12 w-10 rotate-[18deg] rounded-r-[20px] rounded-tl-[10px] rounded-bl-[12px] bg-teal" />
        <div className="absolute left-4 top-12 h-6 w-2 rounded-full bg-teal" />
      </div>
    );
  }

  return (
    <div className="relative h-18 w-18">
      <div className="absolute left-0 top-4 h-9 w-9 rounded-[14px] bg-teal" />
      <div className="absolute right-0 top-4 h-9 w-9 rounded-[14px] bg-teal/92" />
      <div className="absolute left-0 bottom-0 h-9 w-9 rounded-[14px] bg-teal/86" />
      <div className="absolute right-0 bottom-0 h-9 w-9 rounded-[14px] bg-teal/78" />
    </div>
  );
}

export default async function SubmitPage() {
  const submissionCenter = await getSubmissionCenterData();

  return (
    <SiteShell activePath="/submit">
      <section className="rounded-[34px] border border-border bg-white px-6 py-8 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-navy-strong sm:text-[4rem] sm:leading-[1.04]">
            加入 <span className="text-teal">QiuQiuTech</span> 创作者社区
          </h1>
          <p className="mt-4 text-base leading-8 text-copy-soft sm:text-lg">
            分享你的洞察与创意，帮助更多人获得增长。
          </p>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-3">
          {submissionCenter.submissionTypes.map((item) => (
            <article
              key={item.title}
              className="rounded-[30px] border border-border bg-white px-6 py-7 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)]"
            >
              <div className="flex items-center gap-6">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(38,167,163,0.08),rgba(38,167,163,0.02))]">
                  <SubmitIcon type={item.icon} />
                </div>
                <div className="flex-1">
                  <h2 className="text-[2rem] font-semibold tracking-tight text-navy-strong">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-base leading-8 text-copy-soft">{item.description}</p>
                  <Link
                    href="/auth"
                    className="mt-5 inline-flex rounded-[12px] bg-[#ffca1f] px-5 py-3 text-base font-semibold text-navy-strong shadow-[0_4px_16px_rgba(255,202,31,0.14),0_16px_48px_rgba(255,202,31,0.10)]"
                  >
                    立即投稿
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-12">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-navy-strong">投稿流程</h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-teal" />
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {submissionCenter.workflowSteps.map((item, index) => (
              <article key={item.step} className="relative rounded-[28px] border border-border bg-[#fbfcff] px-6 py-7">
                {index < 2 ? (
                  <div className="pointer-events-none absolute right-[-60px] top-14 hidden h-px w-[120px] border-t border-dashed border-[#d6dff0] xl:block" />
                ) : null}
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(38,167,163,0.12),rgba(38,167,163,0.04))] text-3xl font-semibold tracking-tight text-teal">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-[1.7rem] font-semibold tracking-tight text-navy-strong">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base leading-8 text-copy-soft">{item.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
          <div className="rounded-[32px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
                  Structured Form
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy-strong">
                  结构化投稿表单
                </h2>
              </div>
              <span className="rounded-full border border-[#d8efe9] bg-[#f4fbf8] px-3 py-1 text-xs font-medium text-teal">
                支持保存草稿
              </span>
            </div>

            <div className="mt-7">
              <SubmissionDraftForm submissionCenter={submissionCenter} hideHeader />
            </div>

            <div className="mt-4 rounded-[24px] border border-border bg-[#fbfcff] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-copy-soft">正文结构</p>
              <p className="mt-3 text-sm leading-7 text-copy-soft">
                按背景、动作、传播亮点、结果、复用方法五段式填写，平台会再做统一格式化和内容分发。
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="rounded-full bg-navy-strong px-5 py-3 text-sm font-medium text-white shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)]"
              >
                登录后投稿
              </Link>
              <button className="rounded-full border border-[#d8efe9] bg-[#f4fbf8] px-5 py-3 text-sm font-medium text-teal">
                查看投稿规范
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            <section className="rounded-[32px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
              <div className="text-center">
                <h2 className="text-4xl font-semibold tracking-tight text-navy-strong">创作者权益</h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-teal" />
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {submissionCenter.benefits.map((item) => (
                  <article key={item.title} className="rounded-[24px] border border-border bg-[#fbfcff] px-5 py-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(38,167,163,0.12),rgba(38,167,163,0.04))] text-xl text-teal">
                        ●
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight text-navy-strong">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-copy-soft">{item.note}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-border bg-[linear-gradient(135deg,#162b75_0%,#203b93_58%,#1f8cb4_100%)] p-6 text-white shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Review Status
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                审核与联动曝光
              </h2>
              <div className="mt-6 space-y-3">
                {submissionCenter.statusNotes.map((item, index) => (
                  <article
                    key={item.title}
                    className={`rounded-[22px] border px-4 py-4 ${
                      index === 3 ? "border-white/18 bg-white/14" : "border-white/10 bg-white/8"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-white/72">{item.note}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </section>
    </SiteShell>
  );
}
