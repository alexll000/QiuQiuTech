"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type ProjectSlide = {
  title: string;
  label: string;
  partners: string[];
  tags: string[];
  summary: string;
  statValue: string;
  statNote: string;
  href: string;
  paletteClass: string;
  image?: string;
  score?: string;
};

type ProjectCarouselProps = {
  slides: ProjectSlide[];
};

export default function ProjectCarousel({ slides }: ProjectCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const slideCount = slides.length;

  const goTo = useCallback(
    (index: number, dir: "left" | "right" = "right") => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setIsAnimating(false);
      }, 400);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    if (isAnimating) return;
    const nextIndex = (current + 1) % slideCount;
    goTo(nextIndex, "right");
  }, [current, slideCount, isAnimating, goTo]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    const prevIndex = (current - 1 + slideCount) % slideCount;
    goTo(prevIndex, "left");
  }, [current, slideCount, isAnimating, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  const slide = slides[current];

  return (
    <div className="relative">
      {/* 主卡片轮播 */}
      <div className="relative overflow-hidden rounded-[var(--radius-xl)]">
        {/* 背景渐变层 */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slide.paletteClass} transition-all duration-700`}
        />

        {/* 图片层 */}
        <div className="relative h-[220px] overflow-hidden">
          {slide.image ? (
            <img
              src={slide.image}
              alt={slide.title}
              className={`h-full w-full object-cover transition-all duration-500 ${
                isAnimating
                  ? direction === "right"
                    ? "-translate-x-full opacity-0"
                    : "translate-x-full opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            />
          ) : (
            <div
              className={`h-full w-full transition-all duration-500 ${
                isAnimating
                  ? direction === "right"
                    ? "-translate-x-full opacity-0 scale-105"
                    : "translate-x-full opacity-0 scale-105"
                  : "translate-x-0 opacity-100 scale-100"
              }`}
              style={{
                background: `linear-gradient(135deg,
                  rgba(39, 63, 119, 0.9) 0%,
                  rgba(61, 111, 132, 0.85) 50%,
                  rgba(211, 230, 217, 0.8) 100%)`,
              }}
            >
              {/* 装饰性几何图形 */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                <div className="absolute right-1/4 top-1/3 h-16 w-16 rotate-45 bg-white/5" />
              </div>
            </div>
          )}
          {/* 遮罩层 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a5c] via-[#1a3a5c]/30 to-transparent" />

          {/* 热度标签 */}
          {slide.score && (
            <div
              className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff6b6b]/40 to-[#ff8e53]/40 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all duration-400 ${
                isAnimating ? "opacity-0 scale-90" : "opacity-100 scale-100"
              }`}
            >
              <span className="relative h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6b6b] opacity-75" />
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute h-2 w-2 rounded-full bg-[#ff6b6b]" />
                  <span className="absolute h-1 w-1 rounded-full bg-white/90" />
                </span>
              </span>
              <span className="tracking-wide">实时热度</span>
              <span className="font-bold tabular-nums">{slide.score}</span>
            </div>
          )}

          {/* 轮播指示器 - 顶部 */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  goTo(index, index > current ? "right" : "left")
                }
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-6 bg-white"
                    : "w-1 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`跳转到第 ${index + 1} 张`}
              />
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="relative p-5">
          {/* 标签 */}
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[#ff6b6b]/25 px-2.5 py-1 text-[11px] font-semibold text-[#ff6b6b] backdrop-blur-sm">
              {slide.label}
            </span>
            {slide.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h3
            className={`text-[18px] font-bold leading-tight text-white transition-all duration-400 ${
              isAnimating
                ? direction === "right"
                  ? "-translate-y-3 opacity-0"
                  : "translate-y-3 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {slide.title}
          </h3>

          {/* 描述 */}
          <p
            className={`mt-2 text-[13px] leading-relaxed text-white/70 transition-all duration-400 delay-75 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            {slide.summary}
          </p>

          {/* 数据统计 & 按钮 */}
          <div
            className={`mt-4 flex items-center justify-between transition-all duration-400 delay-100 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[18px] font-bold text-white">{slide.statValue}</p>
                <p className="text-[10px] text-white/60">{slide.statNote}</p>
              </div>
            </div>

            <Link
              href={slide.href}
              className="group flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[13px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25 hover:gap-3"
            >
              <span>查看详情</span>
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* 翻页按钮 - 左右两侧 */}
      {slideCount > 1 && (
        <>
          <button
            onClick={prev}
            disabled={isAnimating}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
            aria-label="上一张"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            disabled={isAnimating}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
            aria-label="下一张"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 数字指示器 */}
      <div className="absolute -bottom-1 right-0 flex items-center gap-1 text-[11px] font-medium text-[var(--copy-muted)]">
        <span className="tabular-nums">{String(current + 1).padStart(2, "0")}</span>
        <span>/</span>
        <span className="tabular-nums">{String(slideCount).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
