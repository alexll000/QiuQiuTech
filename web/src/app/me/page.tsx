import { LogoutButton, MarkNotificationReadButton } from "@/components/action-buttons";
import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { MetaList } from "@/components/platform-ui";
import { SiteShell } from "@/components/site-shell";
import { getCurrentUserDashboard } from "@/lib/account-service";
import { buildMetadata } from "@/lib/seo";
import { cookies } from "next/headers";

export const metadata = buildMetadata({
  title: "用户中心",
  description: "管理 QiuQiuTech 的投稿、合作需求、收藏记录、通知与账号资料。",
  path: "/me",
  noIndex: true,
  keywords: ["用户中心", "投稿记录", "合作申请", "收藏记录", "账号资料"],
});

export default async function MePage() {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("qqt_uid")?.value || cookieStore.get("qiuqiutech_uid")?.value;
  const dashboard = await getCurrentUserDashboard(currentUserId);

  return (
    <SiteShell activePath="/me">
      <section className="rounded-[34px] border border-border bg-white px-6 py-7 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
              User Center
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.4rem] sm:leading-[1.06]">
              用户中心统一收口投稿、收藏、合作申请与个人资料。
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-copy-soft">
              后续真实登录态接入后，这里会成为用户回看审核结果、维护个人展示信息、管理合作申请与继续投稿的主工作台。
            </p>
          </div>

          <article className="rounded-[30px] border border-border bg-[linear-gradient(135deg,#0f245b_0%,#15357e_44%,#21b0a9_100%)] p-6 text-white shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)] sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white/14 text-2xl font-semibold text-white">
                Q
              </div>
              <div>
                <p className="text-sm font-medium text-white/72">已登录账号</p>
                <h2 className="mt-1 text-[2rem] font-semibold tracking-tight text-white">
                  {dashboard.profile.displayName}
                </h2>
                <p className="mt-1 text-sm text-white/68">
                  {dashboard.profile.companyName || "QiuQiuTech"} · {dashboard.profile.city || "未设置城市"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <LogoutButton />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {dashboard.stats.map((stat, index) => {
                const statKey = `${stat.label}-${index}`;

                return (
                  <article key={statKey} className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/58">{stat.label}</p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{stat.value}</p>
                  </article>
                );
              })}
            </div>
          </article>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[260px_1fr]">
          <aside className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
              Navigation
            </p>
            <div className="mt-6 space-y-3">
              {dashboard.quickSections.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-[20px] px-4 py-4 text-sm font-medium ${
                    index === 0
                      ? "bg-navy-strong text-white shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)]"
                      : "border border-border bg-[#fbfcff] text-navy-strong"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-5">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboard.overviewCards.map(({ title, description }, index) => (
                <article
                  key={title}
                  className={`rounded-[26px] border p-5 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] ${
                    index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : index === 2 ? "border-[#d8efe9] bg-[#f4fbf8]" : "border-border bg-white"
                  }`}
                >
                  <p className="text-sm font-semibold text-navy-strong">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-copy-soft">{description}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
                      Activity Overview
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-strong">
                      最近任务与状态
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#f4fbf8] px-3 py-1 text-xs font-medium text-teal">
                    账号已登录
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {dashboard.recentActivities.map(({ title, body, status }, index) => (
                    <article
                      key={title}
                      className={`rounded-[22px] border px-4 py-4 ${
                        index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-[#fbfcff]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-navy-strong">{title}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-copy-soft">
                          {status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-copy-soft">{body}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
                <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">我的资料卡</h2>
                <p className="mt-2 text-sm leading-7 text-copy-soft">
                  这里承接身份、认证和可公开展示的信息。
                </p>
                <div className="mt-6">
                  <MetaList items={dashboard.profileFacts} />
                </div>
                <ProfileSettingsForm profile={dashboard.profile} />
              </article>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
                <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">快捷操作</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {dashboard.quickActions.map(({ title, note }, index) => (
                    <article
                      key={title}
                      className={`rounded-[22px] border px-4 py-4 ${
                        index === 1 ? "border-[#d8efe9] bg-[#f4fbf8]" : "border-border bg-[#fbfcff]"
                      }`}
                    >
                      <p className="text-sm font-semibold text-navy-strong">{title}</p>
                      <p className="mt-2 text-sm leading-7 text-copy-soft">{note}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">通知中心</h2>
                  <MarkNotificationReadButton />
                </div>
                <div className="mt-5 space-y-3">
                  {dashboard.notifications.map((item, index) => (
                    <article
                      key={item.id}
                      className={`rounded-[22px] border px-4 py-4 ${
                        !item.isRead && index === 0
                          ? "border-[#d7e7ff] bg-[#f4f8ff]"
                          : "border-border bg-[#fbfcff]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-navy-strong">{item.title}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-copy-soft">
                          {item.isRead ? "已读" : "未读"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-copy-soft">{item.body}</p>
                    </article>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-5 xl:grid-cols-3">
              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
                <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">我的投稿</h2>
                <div className="mt-5 space-y-3">
                  {dashboard.submissions.map((item, index) => (
                    <article
                      key={item.id}
                      className={`rounded-[22px] border px-4 py-4 ${
                        index === 0 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-[#fbfcff]"
                      }`}
                    >
                      <p className="text-sm font-semibold text-navy-strong">{item.title}</p>
                      <p className="mt-1 text-sm text-copy-soft">{item.submissionType}</p>
                      <p className="mt-2 text-sm leading-7 text-copy-soft">{item.status}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
                <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">我的收藏</h2>
                <div className="mt-5 space-y-3">
                  {dashboard.savedItems.map((item) => (
                    <article key={item.id} className="rounded-[22px] border border-border bg-[#fbfcff] px-4 py-4">
                      <p className="text-sm font-semibold text-navy-strong">{item.title}</p>
                      <p className="mt-1 text-sm text-copy-soft">{item.targetType}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
                <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">合作申请</h2>
                <div className="mt-5 space-y-3">
                  {dashboard.applications.map((item, index) => (
                    <article
                      key={item.id}
                      className={`rounded-[22px] border px-4 py-4 ${
                        index === 0 ? "border-[#d8efe9] bg-[#f4fbf8]" : "border-border bg-[#fbfcff]"
                      }`}
                    >
                      <p className="text-sm font-semibold text-navy-strong">{item.requestTitle}</p>
                      <p className="mt-1 text-sm text-copy-soft">{item.city}</p>
                      <p className="mt-2 text-sm leading-7 text-copy-soft">{item.status}</p>
                    </article>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
