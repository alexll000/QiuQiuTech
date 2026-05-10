"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type CaseCard = {
  title: string;
  tag: string;
  category: string;
  summary: string;
  byline: string;
  href: string;
  palette: string;
};

const TABS = [
  { key: "all", label: "全部" },
  { key: "短视频", label: "短视频" },
  { key: "社交媒体", label: "社交媒体" },
  { key: "电商", label: "电商" },
  { key: "品牌营销", label: "品牌营销" },
];

export default function SelectedCasesWithTabs({
  cases,
}: {
  cases: CaseCard[];
}) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? cases
      : cases.filter((c) => c.category === activeTab);

  return (
    <section className="rounded-[var(--radius-2xl)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
      {/* 标题栏 */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-4 w-6 bg-[var(--teal)]" />
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--navy)]">
            精选案例
          </h2>
        </div>
        <Button asChild variant="secondary" size="sm" className="group">
          <Link href="/contents" className="flex items-center gap-1">
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[var(--navy)] after:transition-all after:duration-300 group-hover:after:w-full">
              查看更多
            </span>
            <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </Link>
        </Button>
      </div>

      {/* Tab 切换 */}
      <div className="mb-5 flex gap-1 border-b border-[var(--border)]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 pb-3 text-[13px] font-medium transition-all duration-200 relative
                ${isActive
                  ? "text-[var(--navy)] font-semibold"
                  : "text-[var(--copy-soft)] hover:text-[var(--navy)]"
                }
              `}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[var(--teal)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 案例卡片网格 */}
      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all duration-300"
          >
            {/* 封面区 */}
            <div className={`relative h-44 bg-gradient-to-br ${item.palette}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_42%)]" />
              <div className="absolute bottom-3 left-3">
                <span className="rounded-[var(--radius-full)] bg-white/85 px-3 py-1 text-[11px] font-semibold text-[var(--navy)] backdrop-blur-sm">
                  {item.tag}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 h-18 w-12 rounded-[10px] border border-white/40 bg-white/40 shadow" />
            </div>
            {/* 内容 */}
            <div className="p-4">
              <h3 className="text-[15px] font-semibold tracking-tight text-[var(--copy)] group-hover:text-[var(--teal)] transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.75] text-[var(--copy-soft)]">
                {item.summary}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[12px] text-[var(--copy-muted)]">
                  {item.byline}
                </p>
                <span className="text-[12px] font-medium text-[var(--teal)]">
                  查看详情 →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
