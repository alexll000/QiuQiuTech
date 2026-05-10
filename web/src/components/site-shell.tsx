import Image from "next/image";
import Link from "next/link";
import { SiteSearchPanel } from "@/components/site-search-panel";
import { navItems } from "@/lib/site-data";

export function SiteShell({
  children,
  activePath,
}: {
  children: React.ReactNode;
  activePath: string;
}) {
  return (
    <div className="min-h-screen bg-background text-copy">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-14 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-3 z-20 mb-5 rounded-[24px] border border-white/70 bg-white/92 px-5 py-4 shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <Link href="/" className="flex items-center">
                <Image
                  src="/qiuqiutech-brand-lockup.png"
                  alt="QiuQiuTech"
                  width={459}
                  height={375}
                  className="h-12 w-auto sm:h-14"
                  priority
                />
              </Link>

              <nav className="flex flex-wrap items-center gap-1.5 text-sm text-copy-soft">
                {navItems.map((item) => {
                  const active = activePath === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-3 py-2 ${
                        active
                          ? "bg-surface-muted font-semibold text-navy-strong shadow-[inset_0_-2px_0_0_rgba(18,36,96,0.5)]"
                          : "hover:bg-surface-muted hover:text-navy-strong"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3 lg:flex-shrink-0">
              {/* 搜索面板 - 桌面端 */}
              <div className="hidden lg:block">
                <SiteSearchPanel />
              </div>
              {/* 搜索面板 - 移动端 */}
              <div className="block lg:hidden">
                <SiteSearchPanel className="lg:hidden" />
              </div>
              <Link
                href="/auth"
                className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-3.5 py-2 text-[13px] font-medium text-[var(--navy)] hover:bg-[var(--surface-muted)] transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                登录
              </Link>
              <Link
                href="/submit"
                className="rounded-full bg-[#256FE6] px-3.5 py-2 text-[13px] font-medium text-white hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(18,36,96,0.12),0_8px_24px_rgba(18,36,96,0.08)] transition-all"
              >
                提交内容
              </Link>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6">{children}</main>

        <footer className="mt-8 rounded-[28px] border border-border bg-white px-6 py-5 text-sm text-copy-soft shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)] sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold text-navy-strong">QiuQiuTech</p>
              <p className="mt-1">营销内容、营销事件、营销玩法与合作对接平台框架 Demo</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/contents" className="hover:text-navy-strong">
                营销内容
              </Link>
              <Link href="/topics" className="hover:text-navy-strong">
                专题策展
              </Link>
              <Link href="/requests" className="hover:text-navy-strong">
                合作对接
              </Link>
              <Link href="/admin" className="hover:text-navy-strong">
                后台入口
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-teal">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold tracking-tight text-navy-strong sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-xl text-sm leading-7 text-copy-soft sm:text-base">
        {description}
      </p>
    </div>
  );
}
