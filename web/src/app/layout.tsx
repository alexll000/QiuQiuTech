import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QiuQiuTech",
  description:
    "A premium marketing industry platform for curated content, structured submissions, and collaboration opportunities.",
  metadataBase: new URL("https://qiuqiutech.com"),
  icons: {
    shortcut: "/favicon.ico",
    other: [{ rel: "icon", url: "/favicon.ico" }],
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "QiuQiuTech",
  url: "https://qiuqiutech.com",
  description:
    "QiuQiuTech 是一个聚合营销内容、营销事件、营销玩法与合作对接的公开 Web 平台。",
  inLanguage: "zh-CN",
  publisher: {
    "@type": "Organization",
    name: "QiuQiuTech",
    logo: "https://qiuqiutech.com/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
