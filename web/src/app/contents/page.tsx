import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { FilterChips } from "@/components/platform-ui";
import { listContents } from "@/lib/content-service";
import { contentFilters } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "内容中心",
  description: "浏览 QiuQiuTech 的营销案例、趋势观察、品牌动态与报告解读，获取前沿营销洞察与实战参考。",
  path: "/contents",
  keywords: ["内容中心", "营销案例", "趋势观察", "品牌动态", "报告解读", "营销洞察"],
});

const editorialThemes = [
  {
    palette:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.34),transparent_26%),linear-gradient(160deg,#0d2259_0%,#183c88_45%,#2b7ac5_100%)]",
    shape: "cup",
  },
  {
    palette:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.54),transparent_26%),linear-gradient(160deg,#eff7f2_0%,#dff1df_42%,#c4e6b4_100%)]",
    shape: "bottle",
  },
  {
    palette:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(160deg,#0a122d_0%,#111f5b_48%,#1c4364_100%)]",
    shape: "note",
  },
  {
    palette:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.5),transparent_24%),linear-gradient(160deg,#f3e2d2_0%,#edd8bf_44%,#d6b38f_100%)]",
    shape: "serum",
  },
];

const contentTypeLabels = {
  case: "案例",
  trend: "趋势观察",
  brand_news: "品牌动态",
  report: "报告解读",
  feature: "深度特辑",
} as const;

function PosterArt({ shape, palette }: { shape: string; palette: string }) {
  if (shape === "cup") {
    return (
      <div className={`relative h-full w-full overflow-hidden ${palette}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_35%)]" />
        <div className="absolute bottom-5 left-6 h-44 w-24 rounded-[40px_40px_18px_18px] bg-white shadow-[0_30px_60px_rgba(8,18,44,0.32)]">
          <div className="absolute left-1/2 top-4 h-7 w-16 -translate-x-1/2 rounded-full bg-[#f5f6fa]" />
          <div className="absolute left-1/2 top-[72px] h-20 w-16 -translate-x-1/2 rounded-[50%] border-[9px] border-[#123475] border-t-transparent" />
        </div>
        <div className="absolute bottom-5 right-6 h-48 w-40 rounded-[20px] border border-white/12 bg-white/8 shadow-[0_30px_60px_rgba(8,18,44,0.22)]" />
      </div>
    );
  }

  if (shape === "bottle") {
    return (
      <div className={`relative h-full w-full overflow-hidden ${palette}`}>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(181,222,169,0.6))]" />
        <div className="absolute bottom-8 left-1/2 h-48 w-24 -translate-x-1/2 rounded-[26px] bg-[linear-gradient(180deg,#fdfdfc_0%,#f2f4ef_100%)] shadow-[0_20px_42px_rgba(40,75,34,0.16)]">
          <div className="absolute left-1/2 top-[-10px] h-8 w-10 -translate-x-1/2 rounded-t-[12px] rounded-b-[6px] bg-[#1e2329]" />
          <div className="absolute left-1/2 top-[88px] h-16 w-16 -translate-x-1/2 rounded-full border border-[#d5e7cb]" />
        </div>
        <div className="absolute bottom-5 right-8 h-12 w-12 rounded-full bg-[#9aca5f]/80 blur-[1px]" />
        <div className="absolute bottom-10 right-18 h-16 w-16 rounded-full bg-[#b7de7c]/90" />
      </div>
    );
  }

  if (shape === "serum") {
    return (
      <div className={`relative h-full w-full overflow-hidden ${palette}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,rgba(255,255,255,0.36),transparent_22%)]" />
        <div className="absolute bottom-8 left-1/2 h-40 w-24 -translate-x-1/2 rounded-[12px] bg-[linear-gradient(180deg,#51301f_0%,#1f130d_100%)] shadow-[0_22px_44px_rgba(76,41,18,0.22)]">
          <div className="absolute left-1/2 top-[-26px] h-12 w-12 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#d0b280_0%,#8f6736_100%)]" />
          <div className="absolute left-1/2 top-3 h-20 w-14 -translate-x-1/2 rounded-[8px] border border-white/12" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${palette}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_24%)]" />
      <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[36px] border border-white/14 bg-white/10 shadow-[0_24px_44px_rgba(8,18,44,0.22)]" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/18 bg-white/8" />
    </div>
  );
}

export default async function ContentsPage() {
  const contents = await listContents();

  return (
    <SiteShell activePath="/contents">
      <section className="rounded-[34px] border border-border bg-white px-6 py-7 shadow-[0_20px_54px_rgba(22,43,117,0.05)] sm:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-navy-strong sm:text-[3.6rem] sm:leading-[1.04]">
            内容中心
          </h1>
          <p className="mt-4 text-base leading-8 text-copy-soft sm:text-lg">
            前沿的营销洞察，实战的策略解析。
          </p>
        </div>

        <div className="mt-8 rounded-full border border-border bg-[#fcfdff] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <FilterChips items={contentFilters} />
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {contents.slice(0, 4).map((item, index) => (
            <Link
              key={item.slug}
              href={`/contents/${item.slug}`}
              className="group grid overflow-hidden rounded-[30px] border border-border bg-white shadow-[0_14px_40px_rgba(22,43,117,0.04)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <article className="grid min-h-[320px] lg:grid-cols-[1.18fr_0.82fr]">
                <div className="relative min-h-[220px]">
                  <PosterArt
                    palette={editorialThemes[index % editorialThemes.length]?.palette ?? editorialThemes[0].palette}
                    shape={editorialThemes[index % editorialThemes.length]?.shape ?? "note"}
                  />
                </div>

                <div className="flex flex-col justify-between px-6 py-6 sm:px-7">
                  <div>
                    <span className="inline-flex rounded-full bg-[linear-gradient(135deg,#23b4ac_0%,#1c8fe8_100%)] px-3 py-1 text-sm font-medium text-white shadow-[0_8px_18px_rgba(33,161,187,0.22)]">
                      {contentTypeLabels[item.contentType]}
                    </span>
                    <h2 className="mt-5 text-[2rem] font-semibold tracking-tight text-navy-strong group-hover:text-[#1d8eb6]">
                      {item.title}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-copy-soft">{item.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(item.tags?.length
                        ? item.tags.slice(0, 3).map((tag) => tag.name)
                        : [item.industry?.name, item.brandName].filter(Boolean)
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-[#fbfcff] px-3 py-1.5 text-sm font-medium text-navy-strong"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 text-sm text-copy-soft">
                    {(item.publishedAt ? "近期更新" : "2天前") + "  ·  " + (item.sourceName || "QiuQiuTech")}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-copy-soft">
          {["1", "2", "3", "...", "10"].map((item, index) => (
            <span
              key={item}
              className={`flex h-11 min-w-11 items-center justify-center rounded-full border px-4 ${
                index === 0
                  ? "border-transparent bg-[linear-gradient(135deg,#21b0a9_0%,#1a8fe8_100%)] font-semibold text-white shadow-[0_12px_26px_rgba(37,111,230,0.18)]"
                  : "border-border bg-white text-navy-strong"
              }`}
            >
              {item}
            </span>
          ))}
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-lg text-navy-strong">
            ›
          </span>
        </div>
      </section>
    </SiteShell>
  );
}
