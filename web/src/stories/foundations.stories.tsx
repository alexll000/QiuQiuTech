import type { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
  title: "Foundations/Brand Tokens",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const swatches = [
  { name: "Background", token: "--background", value: "#f3f5f8" },
  { name: "Surface", token: "--surface", value: "#ffffff" },
  { name: "Primary", token: "--primary", value: "#162b75" },
  { name: "Accent", token: "--accent", value: "#26a7a3" },
  { name: "Highlight", token: "--yellow", value: "#ffca28" },
  { name: "Copy", token: "--copy", value: "#223052" },
  { name: "Muted Copy", token: "--copy-soft", value: "#6d7894" },
];

export const Palette: Story = {
  render: () => (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal">Foundation</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy-strong">
          QiuQiuTech 的 UI 基线从 token 开始
        </h1>
        <p className="mt-4 text-base leading-8 text-copy-soft">
          这页不是设计稿，而是把品牌色、圆角、边框和内容密度固定成一个公共起点，避免页面越做越散。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {swatches.map((item) => (
          <article
            key={item.token}
            className="rounded-[24px] border border-border bg-white p-5 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)]"
          >
            <div className="h-28 rounded-[18px] border border-black/5" style={{ background: item.value }} />
            <h2 className="mt-4 text-lg font-semibold text-navy-strong">{item.name}</h2>
            <p className="mt-1 font-mono text-xs text-copy-soft">{item.token}</p>
            <p className="mt-3 font-mono text-sm text-copy">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm font-semibold text-navy-strong">圆角</p>
          <p className="mt-3 text-sm leading-7 text-copy-soft">
            大面板以 24px 到 32px 为主，按钮与标签统一走圆形或圆角胶囊，不新增尖锐卡片。
          </p>
        </article>
        <article className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm font-semibold text-navy-strong">阴影</p>
          <p className="mt-3 text-sm leading-7 text-copy-soft">
            阴影偏轻，只做层次，不做漂浮感；品牌前台避免后台式厚重投影。
          </p>
        </article>
        <article className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm font-semibold text-navy-strong">文案密度</p>
          <p className="mt-3 text-sm leading-7 text-copy-soft">
            默认一屏可扫完，长文案放到详情页；列表、标签和按钮都优先短句。
          </p>
        </article>
      </div>
    </div>
  ),
};
