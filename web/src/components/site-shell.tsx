import Image from "next/image";
import Link from "next/link";
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
        <header className="sticky top-3 z-20 mb-5 rounded-[24px] border border-white/70 bg-white/92 px-5 py-4 shadow-[0_12px_36px_rgba(22,43,117,0.06)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <Link href="/" className="flex items-center">
                <Image
                  src="/qiuqiutech-header-logo.png"
                  alt="QiuQiuTech"
                  width={470}
                  height={430}
                  className="h-11 w-auto sm:h-[3.15rem]"
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
                          ? "bg-surface-muted font-semibold text-navy-strong shadow-[inset_0_-2px_0_0_#256FE6]"
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
              <div className="hidden items-center gap-3 rounded-full border border-border bg-[#fbfcff] px-4 py-2 lg:flex">
                <span className="text-sm text-copy-soft">搜索案例、事件、品牌、玩法</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-base text-navy-strong">
                  ⌕
                </span>
              </div>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-navy-strong hover:bg-surface-muted"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-wechat pulse-soft" />
                登录 / 注册
              </Link>
              <Link
                href="/submit"
                className="rounded-full bg-[#256FE6] px-4 py-2 text-sm font-medium text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(37,111,230,0.18)]"
              >
                提交内容
              </Link>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6">{children}</main>

        <footer className="mt-8 rounded-[28px] border border-border bg-white px-6 py-5 text-sm text-copy-soft shadow-[0_12px_34px_rgba(22,43,117,0.04)] sm:px-8">
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
