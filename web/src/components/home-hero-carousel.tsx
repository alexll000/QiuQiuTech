"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type HeroSlide = {
  title: string;
  label: string;
  partners: string[];
  tags: string[];
  summary: string;
  statValue: string;
  statNote: string;
  href: string;
  paletteClass: string;
};

type HomeHeroCarouselProps = {
  slides: HeroSlide[];
};

const mediaThemes = [
  {
    shell: "border-[#d7dfef] bg-[linear-gradient(180deg,#f7f9fd_0%,#edf2fb_100%)]",
    stage: "bg-[linear-gradient(135deg,#17316b_0%,#20498e_42%,#2a8d88_100%)]",
    card: "bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(239,244,252,0.9)_100%)]",
    bar: "bg-[linear-gradient(180deg,#21478b_0%,#173266_100%)]",
    pillar: "bg-[linear-gradient(180deg,#f1bb3f_0%,#d4861d_100%)]",
    block: "bg-[linear-gradient(180deg,#e63c33_0%,#cf1f27_100%)]",
  },
  {
    shell: "border-[#dbe7ef] bg-[linear-gradient(180deg,#f8fbfb_0%,#eef6f4_100%)]",
    stage: "bg-[linear-gradient(135deg,#274161_0%,#417b80_48%,#c9ded1_100%)]",
    card: "bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(241,246,244,0.92)_100%)]",
    bar: "bg-[linear-gradient(180deg,#2b556d_0%,#1f4053_100%)]",
    pillar: "bg-[linear-gradient(180deg,#d7e5d8_0%,#8aac92_100%)]",
    block: "bg-[linear-gradient(180deg,#f1f4ef_0%,#d8ddd4_100%)]",
  },
  {
    shell: "border-[#e5dfd5] bg-[linear-gradient(180deg,#fbf8f4_0%,#f3ece4_100%)]",
    stage: "bg-[linear-gradient(135deg,#54483e_0%,#8e7566_48%,#d8cabc_100%)]",
    card: "bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(247,243,238,0.92)_100%)]",
    bar: "bg-[linear-gradient(180deg,#6f5a47_0%,#4d3f32_100%)]",
    pillar: "bg-[linear-gradient(180deg,#e5d6c4_0%,#b99268_100%)]",
    block: "bg-[linear-gradient(180deg,#f4ede4_0%,#d6c6b7_100%)]",
  },
];

export function HomeHeroCarousel({ slides }: HomeHeroCarouselProps) {
  const safeSlides = slides.length ? slides : [];
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = safeSlides[activeIndex];
  const theme = useMemo(
    () => mediaThemes[activeIndex % mediaThemes.length],
    [activeIndex],
  );

  if (!activeSlide) return null;

  const visibleTags = activeSlide.tags
    .filter((tag) => tag.trim().toLowerCase() !== activeSlide.label.trim().toLowerCase())
    .slice(0, 2);

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + safeSlides.length) % safeSlides.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % safeSlides.length);
  };

  return (
    <article className="self-start overflow-hidden rounded-[32px] border border-border bg-white p-6 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:p-7">
      <div className="flex items-center justify-between gap-3 border-b border-[#edf1f7] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-copy-soft">Featured Case</p>
          <p className="mt-2 text-sm text-copy-soft">首页主视觉案例位</p>
        </div>
        <span className="rounded-full border border-[#dbe3f3] bg-[#f4f7fb] px-3 py-1 text-xs font-medium text-navy-strong">
          {activeSlide.label}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:min-h-[640px] lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:items-stretch">
        <div className="flex flex-col gap-6 lg:min-h-[640px] lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-navy-strong">
              {activeSlide.partners.map((partner) => (
                <span key={partner} className="rounded-full border border-border bg-white px-3 py-1">
                  {partner}
                </span>
              ))}
            </div>

            <h2 className="mt-6 max-w-[12ch] text-[2.05rem] font-semibold tracking-tight text-navy-strong sm:text-[2.55rem] sm:leading-[1.08] lg:min-h-[4.4em]">
              {activeSlide.title}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-copy-soft sm:text-[0.98rem] lg:min-h-[5.25rem]">
              {activeSlide.summary}
            </p>

            <div className="mt-5 flex min-h-[3.25rem] flex-wrap gap-2.5">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#dce5f5] bg-[#f6f9ff] px-3 py-1.5 text-sm font-medium text-navy-strong"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[#edf0f6] bg-[#fffdfa] p-5">
              <p className="text-sm font-medium text-copy-soft">案例信号</p>
              <p className="mt-4 text-[2.4rem] font-semibold tracking-tight text-[#b4832a]">
                {activeSlide.statValue}
              </p>
              <p className="mt-2 text-sm leading-6 text-copy-soft">{activeSlide.statNote}</p>
            </div>

            <div className="rounded-[24px] border border-border bg-[#fbfcff] p-5">
              <p className="text-sm font-medium text-copy-soft">信息结构</p>
              <div className="mt-4 space-y-2 text-sm leading-6 text-copy-soft">
                <p>一个主类型标签，两个以内主题标签。</p>
                <p>固定比例媒体区，适配运营图与品牌主视觉。</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`relative min-h-[560px] overflow-hidden rounded-[28px] border ${theme.shell} lg:min-h-[640px]`}>
          <div className="relative h-[560px] w-full lg:h-[640px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(61,111,132,0.22),transparent_22%),radial-gradient(circle_at_20%_18%,rgba(37,111,230,0.16),transparent_24%)]" />
            <div className="absolute inset-x-6 top-6 flex items-start justify-between gap-3">
              <div className="rounded-full border border-white/70 bg-white/88 px-3 py-1 text-xs font-medium text-navy-strong shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] backdrop-blur-sm">
                主图建议 4:3 / 5:4
              </div>
              <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1 text-xs text-copy-soft backdrop-blur-sm">
                {String(activeIndex + 1).padStart(2, "0")} / {String(safeSlides.length).padStart(2, "0")}
              </div>
            </div>

            <button
              type="button"
              onClick={goPrev}
              aria-label="上一张案例"
              className="absolute left-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/86 text-navy-strong shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)] backdrop-blur-sm transition hover:bg-white"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M11.75 4.5 6.25 10l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="下一张案例"
              className="absolute right-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/86 text-navy-strong shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)] backdrop-blur-sm transition hover:bg-white"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8.25 4.5 13.75 10l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={`absolute inset-x-8 bottom-8 top-20 rounded-[26px] ${theme.stage} shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)]`} />
            <div className={`absolute left-[12%] top-[22%] h-[46%] w-[34%] rounded-[28px] border border-white/30 ${theme.card} shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)]`} />
            <div className={`absolute left-[16%] top-[30%] h-[18%] w-[18%] rounded-[18px] ${theme.bar}`} />
            <div className={`absolute left-[42%] top-[24%] h-[52%] w-[18%] rounded-[22px] ${theme.pillar} shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)]`} />
            <div className={`absolute right-[12%] top-[28%] h-[42%] w-[24%] rounded-[24px] border border-white/18 ${theme.block} shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)]`} />

            <div className="absolute bottom-6 left-6 right-6 rounded-[22px] border border-white/70 bg-white/90 p-4 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-navy-strong">案例视觉展示位</p>
                  <p className="mt-1 text-sm text-copy-soft">适合封面图、海报拼贴或品牌主 KV。</p>
                </div>
                <Link
                  href={activeSlide.href}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-navy-strong transition hover:border-[#cbd8ec] hover:bg-[#f8fbff]"
                >
                  查看案例
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
