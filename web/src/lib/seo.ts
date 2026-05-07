import type { Metadata } from "next";

const DEFAULT_TITLE = "QiuQiuTech";
const DEFAULT_DESCRIPTION =
  "QiuQiuTech 是一个聚合营销内容、营销事件、营销玩法与合作对接的公开 Web 平台。";
const SITE_URL = "https://qiuqiutech.com";
const DEFAULT_KEYWORDS = [
  "QiuQiuTech",
  "营销平台",
  "营销案例",
  "营销事件",
  "营销玩法",
  "品牌合作",
  "市场人对接",
  "营销内容聚合",
  "品牌营销",
  "SocialBeta 类似平台",
];

export function buildMetadata({
  title,
  description,
  keywords,
  path,
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = path ? `${SITE_URL}${path}` : SITE_URL;
  const ogImage = image || `${SITE_URL}/qiuqiutech-header-logo.png`;

  return {
    title: fullTitle,
    description: resolvedDescription,
    keywords: keywords || DEFAULT_KEYWORDS,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: fullTitle,
      description: resolvedDescription,
      type: "website",
      url: canonicalUrl,
      siteName: DEFAULT_TITLE,
      locale: "zh_CN",
      images: [
        {
          url: ogImage,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
  };
}

export { DEFAULT_KEYWORDS, SITE_URL };
