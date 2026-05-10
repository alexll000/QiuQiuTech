import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { searchSite } from "@/lib/content-service";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "站内搜索",
  description: "搜索 QiuQiuTech 的营销内容、专题策展与合作需求。",
  path: "/search",
  keywords: ["站内搜索", "营销内容搜索", "专题搜索", "合作需求搜索"],
  noIndex: true,
});

const sectionTone = {
  contents: "border-[#d7e7ff] bg-[#f4f8ff]",
  topics: "border-[#d8efe9] bg-[#f4fbf8]",
  requests: "border-[#f2e3b3] bg-[#fffaf0]",
} as const;

const sectionTitle = {
  contents: "内容结果",
  topics: "专题结果",
  requests: "合作结果",
} as const;

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type SearchSectionKey = "all" | "contents" | "topics" | "requests";
type SearchSortKey = "relevance" | "latest" | "title_asc" | "title_desc";

const filterLabels: Record<SearchSectionKey, string> = {
  all: "全部结果",
  contents: "内容",
  topics: "专题",
  requests: "合作",
};

const sortLabels: Record<SearchSortKey, string> = {
  relevance: "按相关度",
  latest: "按最近更新",
  title_asc: "标题 A-Z",
  title_desc: "标题 Z-A",
};

const sectionHints: Record<Exclude<SearchSectionKey, "all">, string[]> = {
  contents: ["改用更短关键词", "尝试品牌名 / 行业词", "切到“全部结果”查看跨栏位匹配"],
  topics: ["尝试“专题名 + 行业词”组合", "查看“内容”栏位是否已有相关案例"],
  requests: ["尝试城市、合作类型、预算词", "改搜“联名 / 快闪 / 节点”等需求词"],
};

function parseTimestamp(value?: string) {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function compareTitle(a: string, b: string, order: "asc" | "desc") {
  const result = a.localeCompare(b, "zh-CN");
  return order === "asc" ? result : -result;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = params.q;
  const q = Array.isArray(rawQuery) ? rawQuery[0] || "" : rawQuery || "";
  const rawType = params.type;
  const type = (Array.isArray(rawType) ? rawType[0] : rawType) || "all";
  const activeType: SearchSectionKey =
    type === "contents" || type === "topics" || type === "requests" ? type : "all";
  const rawSort = params.sort;
  const sort = (Array.isArray(rawSort) ? rawSort[0] : rawSort) || "relevance";
  const activeSort: SearchSortKey =
    sort === "latest" || sort === "title_asc" || sort === "title_desc" ? sort : "relevance";
  const result = await searchSite(q);

  const sections = [
    {
      key: "contents" as const,
      items: result.contents.map((item) => ({
        href: `/contents/${item.slug}`,
        title: item.title,
        summary: item.summary,
        meta: [item.brandName, item.sourceName, item.industry?.name].filter(Boolean).join("  ·  "),
        updatedAt: item.publishedAt || "",
      })),
    },
    {
      key: "topics" as const,
      items: result.topics.map((item) => ({
        href: `/topics/${item.slug}`,
        title: item.title,
        summary: item.intro || "专题聚合了相关内容、合作信号与长期可复用的行业资产。",
        meta: [item.topicType || "专题策展"].filter(Boolean).join("  ·  "),
        updatedAt: "",
      })),
    },
    {
      key: "requests" as const,
      items: result.requests.map((item) => ({
        href: `/requests/${item.slug}`,
        title: item.title,
        summary: item.summary,
        meta: [item.city, item.industry?.name, item.requestType].filter(Boolean).join("  ·  "),
        updatedAt: item.publishedAt || "",
      })),
    },
  ].map((section) => {
    const sortedItems = [...section.items];

    if (activeSort === "latest") {
      sortedItems.sort((a, b) => parseTimestamp(b.updatedAt) - parseTimestamp(a.updatedAt));
    } else if (activeSort === "title_asc") {
      sortedItems.sort((a, b) => compareTitle(a.title, b.title, "asc"));
    } else if (activeSort === "title_desc") {
      sortedItems.sort((a, b) => compareTitle(a.title, b.title, "desc"));
    }

    return { ...section, items: sortedItems };
  });
  const visibleSections =
    activeType === "all" ? sections : sections.filter((section) => section.key === activeType);
  const sectionCounts = {
    contents: sections.find((section) => section.key === "contents")?.items.length || 0,
    topics: sections.find((section) => section.key === "topics")?.items.length || 0,
    requests: sections.find((section) => section.key === "requests")?.items.length || 0,
  };

  function buildSearchHref(next: { type?: SearchSectionKey; sort?: SearchSortKey }) {
    const typeValue = next.type || activeType;
    const sortValue = next.sort || activeSort;
    const query = result.query;
    if (!query) return "/search";

    const search = new URLSearchParams({ q: query });
    if (typeValue !== "all") search.set("type", typeValue);
    if (sortValue !== "relevance") search.set("sort", sortValue);
    return `/search?${search.toString()}`;
  }

  return (
    <SiteShell activePath="">
      <section className="rounded-[34px] border border-border bg-white px-6 py-7 shadow-[0_4px_16px_rgba(18,36,96,0.12),0_16px_48px_rgba(18,36,96,0.08)] sm:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.4rem] sm:leading-[1.06]">
            站内搜索
          </h1>
          <p className="mt-4 text-base leading-8 text-copy-soft sm:text-lg">
            {result.query
              ? `当前关键词：${result.query}，已聚合内容、专题与合作需求结果。`
              : "输入关键词后，可同时搜索内容、专题策展与合作需求。"}
          </p>
          <p className="mt-4 text-sm text-copy-soft">
            共找到 {result.total} 条结果
            {result.query ? `，匹配词“${result.query}”` : "，当前尚未输入关键词"}。
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {(Object.keys(filterLabels) as SearchSectionKey[]).map((filterKey) => {
            const href = buildSearchHref({ type: filterKey });
            const active = activeType === filterKey;
            const count =
              filterKey === "all"
                ? result.total
                : sectionCounts[filterKey as Exclude<SearchSectionKey, "all">];

            return (
              <Link
                key={filterKey}
                href={href}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${
                  active
                    ? "border-transparent bg-[linear-gradient(135deg,#25b2aa_0%,#1c8fe8_100%)] text-white shadow-[0_4px_16px_rgba(37,111,230,0.14),0_16px_48px_rgba(37,111,230,0.10)]"
                    : "border-border bg-white text-navy-strong"
                }`}
              >
                {filterLabels[filterKey]}（{count}）
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-[#fbfcff] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-copy-soft">排序</p>
          {(Object.keys(sortLabels) as SearchSortKey[]).map((sortKey) => (
            <Link
              key={sortKey}
              href={buildSearchHref({ sort: sortKey })}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                activeSort === sortKey
                  ? "bg-navy-strong text-white"
                  : "border border-border bg-white text-copy-soft"
              }`}
            >
              {sortLabels[sortKey]}
            </Link>
          ))}
        </div>

        {!result.query ? (
          <div className="mt-8 rounded-[26px] border border-border bg-[#fbfcff] px-5 py-5 text-sm leading-7 text-copy-soft">
            你可以搜索品牌名、行业、标签、专题标题、合作需求标题或摘要，例如“联名”“快闪”“品牌合作”“节点营销”。
          </div>
        ) : null}

        {result.query && result.total === 0 ? (
          <div className="mt-8 rounded-[26px] border border-border bg-[#fbfcff] px-5 py-5">
            <p className="text-sm font-semibold text-navy-strong">当前没有找到匹配结果</p>
            <p className="mt-2 text-sm leading-7 text-copy-soft">
              可尝试更短关键词，或改搜品牌名、行业词、标签词。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["联名", "快闪", "品牌合作", "节点营销", "内容营销"].map((hint) => (
                <Link
                  key={hint}
                  href={`/search?q=${encodeURIComponent(hint)}`}
                  className="rounded-full border border-border bg-white px-3 py-1 text-xs text-navy-strong"
                >
                  试试：{hint}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className={`mt-8 grid gap-5 ${visibleSections.length > 1 ? "xl:grid-cols-3" : "max-w-3xl"}`}>
          {visibleSections.map((section) => (
            <section key={section.key} className="rounded-[28px] border border-border bg-white p-5 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)]">
              <div className={`rounded-[20px] border px-4 py-4 ${sectionTone[section.key]}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">
                  {sectionTitle[section.key]}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-navy-strong">
                  {section.items.length}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {section.items.length ? (
                  section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-[22px] border border-border bg-[#fbfcff] px-4 py-4 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <h2 className="text-lg font-semibold tracking-tight text-navy-strong">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-copy-soft">{item.summary}</p>
                      {item.meta ? (
                        <p className="mt-3 text-xs text-copy-soft">{item.meta}</p>
                      ) : null}
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-border bg-[#fbfcff] px-4 py-4">
                    <p className="text-sm font-medium text-navy-strong">这一栏暂时没有匹配结果</p>
                    <ul className="mt-2 space-y-1 text-sm leading-7 text-copy-soft">
                      {sectionHints[section.key].map((hint) => (
                        <li key={hint}>- {hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
