import Link from "next/link";
import { authActionHighlights, authFeatureNotes, authQrPattern } from "@/lib/form-blueprints";

export function AuthModal() {
  return (
    <div className="relative z-10 w-full max-w-[920px] overflow-hidden rounded-[28px] border border-white/18 bg-white shadow-[0_26px_70px_rgba(10,18,44,0.22)]">
      <div className="grid min-h-[560px] lg:grid-cols-[0.86fr_1.14fr]">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(186,237,255,0.92),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(135,118,255,0.82),transparent_30%),linear-gradient(160deg,#1398eb_0%,#64b5ff_34%,#7a84ff_67%,#8b5cf6_100%)] p-6 text-white sm:p-7">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-medium text-white/92 backdrop-blur-sm"
          >
            返回首页
          </Link>

          <div className="relative mt-8 max-w-[290px]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              QiuQiuTech
            </p>
            <h1 className="mt-4 text-[1.9rem] font-semibold tracking-tight sm:text-[2.35rem]">
              欢迎进入 QiuQiuTech
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/78">
              营销内容、营销事件、营销玩法与合作对接，统一收进一个轻量但专业的行业平台。
            </p>
          </div>

          <div className="relative mt-8 space-y-3.5">
            {authFeatureNotes.map((item) => (
              <div key={item} className="flex items-center gap-3 text-[13px] text-white/88">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/14 text-sm">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-6 right-6 rounded-[22px] border border-white/18 bg-white/10 p-3.5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-white/88">新用户入口</p>
            <p className="mt-2 text-sm leading-6 text-white/72">
              注册后可提交内容、保存草稿、发布合作需求，并追踪审核与联系申请记录。
            </p>
            <button className="mt-3 inline-flex rounded-full border border-white/28 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
              注册账号
            </button>
          </div>
        </section>

        <section className="relative bg-white p-6 sm:p-7">
          <Link
            href="/"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-3xl text-navy-strong hover:bg-surface-muted"
          >
            ×
          </Link>

          <div className="mx-auto flex h-full max-w-[470px] flex-col justify-center">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">
                  Sign In
                </p>
                <h2 className="mt-2.5 text-[1.9rem] font-semibold tracking-tight text-navy-strong">
                  登录
                </h2>
              </div>
              <div className="rounded-full border border-border bg-[#f7f9fc] p-1 text-[13px] font-medium text-copy-soft">
                <div className="flex items-center gap-1">
                  <span className="rounded-full bg-white px-4 py-2 text-navy-strong shadow-[0_6px_18px_rgba(22,43,117,0.08)]">
                    密码登录
                  </span>
                  <span className="px-4 py-2">微信扫码</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
              <div className="rounded-[22px] border border-border bg-[#f7f9fc] p-4">
                <p className="text-sm font-semibold text-navy-strong">微信扫码登录</p>
                <p className="mt-2 text-sm leading-6 text-copy-soft">
                  扫码后自动完成登录与身份同步，适合移动端已登录微信的用户。
                </p>

                <div className="mt-4 flex justify-center rounded-[18px] border border-border bg-white p-3">
                  <div className="grid grid-cols-12 gap-1 rounded-[14px] bg-white p-2 shadow-[0_10px_30px_rgba(22,43,117,0.08)]">
                    {authQrPattern.flatMap((row, rowIndex) =>
                      row.split("").map((cell, colIndex) => (
                        <span
                          key={`${rowIndex}-${colIndex}`}
                          className={`h-2.5 w-2.5 rounded-[2px] ${
                            cell === "1" ? "bg-navy-strong" : "bg-white"
                          }`}
                        />
                      )),
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-[18px] border border-[#d8efe9] bg-[#f4fbf8] px-4 py-3.5">
                  <p className="text-sm font-semibold text-navy-strong">扫码后支持</p>
                  <p className="mt-2 text-sm leading-6 text-copy-soft">
                    自动进入用户中心、同步投稿记录、查看合作申请，以及后续的企业身份认证。
                  </p>
                </div>
              </div>

              <div className="rounded-[22px] border border-border bg-white">
                <div className="border-b border-border px-5 py-4">
                  <p className="text-sm font-semibold text-navy-strong">账号登录</p>
                </div>

                <div className="space-y-3.5 p-[18px]">
                  <div className="rounded-[20px] border border-border bg-[#f7f9fc] p-4">
                    <label className="text-xs uppercase tracking-[0.16em] text-copy-soft">
                      手机号 / 邮箱
                    </label>
                    <div className="mt-3 rounded-full border border-border bg-white px-4 py-3 text-sm text-copy-soft">
                      请输入手机号或邮箱
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-border bg-[#f7f9fc] p-4">
                    <label className="text-xs uppercase tracking-[0.16em] text-copy-soft">
                      密码
                    </label>
                    <div className="mt-3 rounded-full border border-border bg-white px-4 py-3 text-sm text-copy-soft">
                      ********
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-copy-soft">7 天内自动登录</span>
                    <button className="font-medium text-navy-strong">忘记密码？</button>
                  </div>

                  <button className="rounded-full bg-[#2e2e2e] px-5 py-3 text-center text-[15px] font-medium text-white hover:bg-[#1e1e1e]">
                    登录
                  </button>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-navy-strong hover:bg-surface-muted">
                      注册账号
                    </button>
                    <button className="rounded-full border border-[#d8efe9] bg-[#f4fbf8] px-5 py-2.5 text-sm font-medium text-teal hover:opacity-90">
                      使用验证码登录
                    </button>
                  </div>

                  <div className="rounded-[20px] border border-border bg-[#fbfcff] p-4">
                    <p className="text-sm font-semibold text-navy-strong">登录后可操作</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {authActionHighlights.map((item) => (
                        <div
                          key={item}
                          className="rounded-[18px] border border-border bg-white px-4 py-3 text-sm text-copy-soft"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
