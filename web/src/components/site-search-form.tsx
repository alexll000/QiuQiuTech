"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HOT_SEARCHES = [
  "品牌营销",
  "抖音",
  "小红书",
  "跨界联名",
  "品牌升级",
  "代言人",
  "Campaign",
  "整合营销",
];

export function SiteSearchForm({
  className = "",
  placeholder = "搜索案例、资讯、素材...",
  initialValue = "",
  compact = false,
}: {
  className?: string;
  placeholder?: string;
  initialValue?: string;
  /** 紧凑模式：用于头部导航，原按钮样式 */
  compact?: boolean;
}) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialValue);

  function performSearch(q?: string) {
    const searchTerm = (q ?? keyword).trim();
    if (searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/search");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  }

  // 紧凑模式：头部导航原按钮样式（放大镜图标 + 文字）
  if (compact) {
    return (
      <button
        onClick={() => router.push("/search")}
        className={`group flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[var(--copy-soft)] shadow-[var(--shadow-sm)] transition-all hover:border-[var(--border-strong)] hover:text-[var(--navy)] hover:shadow-[var(--shadow-md)] ${className}`.trim()}
        aria-label="打开搜索"
      >
        <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>
        <span className="text-[13px] font-medium">搜索</span>
      </button>
    );
  }

  // 完整模式：搜索页面 SocialBeta 风格
  return (
    <div className={`w-full ${className}`.trim()}>
      {/* 搜索框 - SocialBeta 风格 */}
      <div className="flex items-center border border-[#e0e0e0] rounded overflow-hidden bg-white">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-[15px] text-[#333] placeholder:text-[#999] outline-none bg-transparent"
        />
        <button
          onClick={() => performSearch()}
          className="px-6 py-3 bg-[#222] text-white text-[14px] font-medium hover:bg-[#444] transition-colors flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
          搜索
        </button>
      </div>

      {/* 热门搜索 */}
      <div className="mt-6">
        <div className="text-[13px] text-[#999] mb-3">热门搜索</div>
        <div className="flex flex-wrap gap-2.5">
          {HOT_SEARCHES.map((tag) => (
            <button
              key={tag}
              onClick={() => performSearch(tag)}
              className="px-3.5 py-1.5 bg-[#f5f5f5] text-[#333] text-[13px] rounded-sm hover:bg-[#eee] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SiteSearchForm;
