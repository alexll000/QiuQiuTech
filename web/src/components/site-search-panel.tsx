"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HOT_SEARCHES = [
  "新品营销",
  "节日营销",
  "跨界营销",
  "广告片",
  "女性营销",
  "ESG营销",
  "1001个品牌地标",
  "小红书",
  "AI",
  "春节",
  "美团",
  "美妆",
];

type SearchResult = {
  contents: Array<{ slug: string; title: string; summary: string; href: string }>;
  topics: Array<{ slug: string; title: string; intro?: string; href: string }>;
  requests: Array<{ slug: string; title: string; summary?: string; href: string }>;
};

export function SiteSearchPanel({
  className = "",
  placeholder = "请输入搜索品牌案例关键词",
}: {
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetPanelState = useCallback(() => {
    setKeyword("");
    setResults(null);
    setActiveIndex(-1);
    setLoading(false);
  }, []);

  const closePanel = useCallback(() => {
    resetPanelState();
    setOpen(false);
  }, [resetPanelState]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closePanel();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [closePanel, open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [closePanel, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const doSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed || trimmed.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=5`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setResults({
            contents: data.contents || [],
            topics: data.topics || [],
            requests: data.requests || [],
          });
        } else {
          setResults(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setResults(null);
      });
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setKeyword(val);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const allItems = [
      ...(results?.contents || []),
      ...(results?.topics || []),
      ...(results?.requests || []),
    ];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && allItems[activeIndex]) {
        router.push(allItems[activeIndex].href);
        closePanel();
      } else if (keyword.trim()) {
        closePanel();
        router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
      }
    }
  }

  function totalResults() {
    if (!results) return 0;
    return results.contents.length + results.topics.length + results.requests.length;
  }

  function handleHotTag(tag: string) {
    closePanel();
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  }

  function handleViewAll() {
    closePanel();
    if (keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
      return;
    }
    router.push("/search");
  }

  return (
    <div ref={panelRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 px-1 py-2 text-[14px] transition-colors ${
          open ? "text-[#111]" : "text-copy-soft hover:text-[#111]"
        }`}
        aria-label="打开搜索"
        aria-expanded={open}
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
          />
        </svg>
        <span>搜索</span>
      </button>

      {open && (
        <div className="search-panel-enter fixed inset-x-0 top-0 z-[80] min-h-[470px] overflow-hidden border-b border-[#efefef] bg-white shadow-none">
          <div className="mx-auto w-[min(calc(100vw-640px),1410px)] min-w-[980px] pb-[54px] pt-[42px]">
            <div className="mb-[36px] flex items-center justify-between">
              <div className="text-[34px] font-bold leading-none text-[#111]">搜索</div>
              <button
                type="button"
                onClick={closePanel}
                className="mr-0 flex h-12 w-12 items-center justify-center text-[#111] transition-opacity hover:opacity-70"
                aria-label="关闭搜索"
              >
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex w-full items-stretch">
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-6 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9b9b9b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
                  />
                </svg>
                <Input
                  ref={inputRef}
                  value={keyword}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder={placeholder}
                  aria-label="请输入搜索品牌案例关键词"
                  className={`h-[88px] rounded-none border-[2px] border-[#404040] pl-[70px] pr-14 text-[18px] text-[#333] shadow-none placeholder:text-[#979797] ${
                    inputFocused ? "border-[#111]" : ""
                  }`}
                />
                {keyword ? (
                  <button
                    type="button"
                    onClick={() => {
                      setKeyword("");
                      setResults(null);
                      setLoading(false);
                      inputRef.current?.focus();
                    }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#b5b5b5] transition-colors hover:text-[#555]"
                    aria-label="清空搜索"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                    </svg>
                  </button>
                ) : null}
              </div>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleViewAll}
                className="h-[88px] min-w-[188px] rounded-none bg-[#353535] px-8 text-[18px] font-semibold shadow-none hover:translate-y-0 hover:bg-[#353535] hover:shadow-none"
              >
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
                  />
                </svg>
                搜索
              </Button>
            </div>
          </div>

          {!keyword.trim() && (
            <div className="mx-auto w-[min(calc(100vw-640px),1410px)] min-w-[980px] pb-[52px]">
              <div className="mb-7 text-[34px] font-bold leading-none text-[#111]">热门搜索</div>
              <div className="flex max-w-[1110px] flex-wrap gap-x-[18px] gap-y-[28px]">
                {HOT_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleHotTag(tag)}
                    className="min-h-[62px] rounded-[10px] border border-[#e8e8e8] bg-white px-8 text-[18px] font-medium leading-none text-[#333] transition-colors hover:border-[#dadada] hover:text-[#111]"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="px-[68px] py-10 text-center text-[18px] text-[#999]">
              搜索中...
            </div>
          )}

          {!loading && results && (
            <div className="max-h-[420px] overflow-y-auto border-t border-[#f3f3f3]">
              {totalResults() === 0 ? (
                <div className="px-[68px] py-10 text-center text-[18px] text-[#999]">
                  未找到相关结果
                </div>
              ) : (
                <>
                  {results.contents.map((item, i) => (
                    <SearchResultItem
                      key={item.href}
                      href={item.href}
                      title={item.title}
                      summary={item.summary}
                      type="内容"
                      active={i === activeIndex}
                      onSelect={closePanel}
                    />
                  ))}
                  {results.topics.map((item, i) => (
                    <SearchResultItem
                      key={item.href}
                      href={item.href}
                      title={item.title}
                      summary={item.intro}
                      type="专题"
                      active={results.contents.length + i === activeIndex}
                      onSelect={closePanel}
                    />
                  ))}
                  {results.requests.map((item, i) => (
                    <SearchResultItem
                      key={item.href}
                      href={item.href}
                      title={item.title}
                      summary={item.summary}
                      type="合作"
                      active={results.contents.length + results.topics.length + i === activeIndex}
                      onSelect={closePanel}
                    />
                  ))}

                  <div className="border-t border-[#efefef] px-5 py-5 text-center">
                    <button
                      onClick={handleViewAll}
                      className="text-[15px] font-medium text-[#222] hover:underline"
                    >
                      查看全部 {totalResults()} 条结果
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {!loading && !results && keyword.trim().length > 0 && keyword.trim().length < 2 && (
            <div className="border-t border-[#f3f3f3] px-[68px] py-10 text-center text-[18px] text-[#bbb]">
              请继续输入（至少 2 个字符）
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultItem({
  href,
  title,
  summary,
  type,
  active,
  onSelect,
}: {
  href: string;
  title: string;
  summary?: string;
  type: string;
  active: boolean;
  onSelect: () => void;
}) {
  const router = useRouter();

  function handleClick() {
    onSelect();
    router.push(href);
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full border-b border-[#f2f2f2] px-5 py-3.5 text-left transition-colors ${
        active ? "bg-[#f7f7f7]" : "hover:bg-[#fafafa]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`rounded-[2px] px-2 py-0.5 text-[10px] font-medium ${
            type === "内容"
              ? "bg-[#f3f4f6] text-[#374151]"
              : type === "专题"
                ? "bg-[#eef2ff] text-[#4338ca]"
                : "bg-[#fff7ed] text-[#c2410c]"
          }`}
        >
          {type}
        </span>
        <span className="truncate text-[13px] font-medium text-[#222]">{title}</span>
      </div>
      {summary ? <p className="mt-1 truncate text-[12px] text-[#777]">{summary}</p> : null}
    </button>
  );
}
