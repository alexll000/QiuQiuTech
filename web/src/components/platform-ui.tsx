import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.06fr_0.94fr]">
      <div className="iridescence-brand rounded-[32px] border border-border bg-white p-6 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe4f2] bg-[#f8fafe] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-copy-soft">
          <span className="h-2 w-2 rounded-full bg-teal" />
          {eyebrow}
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-navy-strong sm:text-5xl lg:text-[3.45rem] lg:leading-[1.04]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-copy-soft sm:text-lg">{description}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>

      <div className="grid gap-4">{aside}</div>
    </section>
  );
}

export function InsightPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-navy-strong">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-copy-soft">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function FilterChips({
  items,
  activeIndex = 0,
}: {
  items: string[];
  activeIndex?: number;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item, index) => (
        <span
          key={item}
          className={`rounded-full border px-5 py-2.5 text-sm font-medium ${
            index === activeIndex
              ? "border-transparent bg-[linear-gradient(135deg,#25b2aa_0%,#1c8fe8_100%)] text-white shadow-[0_4px_16px_rgba(37,111,230,0.14),0_16px_48px_rgba(37,111,230,0.10)]"
              : "border-border bg-white text-navy-strong"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function MetaList({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="border-b border-border pb-4 last:border-b-0">
          <p className="text-sm font-semibold text-navy-strong">{item.label}</p>
          <p className="mt-2 text-sm leading-7 text-copy-soft">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function DirectoryCard({
  label,
  title,
  description,
  meta,
  href,
  accent = "default",
}: {
  label: string;
  title: string;
  description: string;
  meta: string;
  href?: string;
  accent?: "default" | "soft" | "strong";
}) {
  const className =
    accent === "strong"
      ? "border-[#d6e4ff] bg-[#f4f8ff]"
      : accent === "soft"
        ? "border-[#d8efe9] bg-[#f4fbf8]"
        : "border-border bg-white";

  const content = (
    <article className={`rounded-[28px] border p-5 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] ${className}`}>
      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-copy-soft">
        {label}
      </span>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-navy-strong">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-copy-soft">{description}</p>
      <p className="mt-4 text-sm font-medium text-copy">{meta}</p>
    </article>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function RailCard({
  title,
  body,
  tone = "default",
}: {
  title: string;
  body: string;
  tone?: "default" | "strong";
}) {
  return (
    <article
      className={`rounded-[24px] border p-5 ${
        tone === "strong"
          ? "border-[#d7e7ff] bg-[#f4f8ff]"
          : "border-border bg-[#fbfcff]"
      }`}
    >
      <h3 className="text-lg font-semibold tracking-tight text-navy-strong">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-copy-soft">{body}</p>
    </article>
  );
}

export function ActionRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-3">{children}</div>;
}

export function PrimaryButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full bg-navy-strong px-5 py-3 text-sm font-medium text-white hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)]"
    >
      {label}
    </Link>
  );
}

export function SecondaryButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-navy-strong hover:bg-surface-muted"
    >
      {label}
    </Link>
  );
}
