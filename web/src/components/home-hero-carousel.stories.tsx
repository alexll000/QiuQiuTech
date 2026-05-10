import type { Meta, StoryObj } from "@storybook/nextjs";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";

const slides = [
  {
    title: "麦当劳芍药季如何把门店事件做成城市内容入口",
    label: "精选案例",
    partners: ["McDonald's", "QiuQiuTech"],
    tags: ["节点营销", "线下体验", "城市事件"],
    summary: "主视觉不只放一张图，而是把案例价值、标签结构和后续进入动作一起讲清楚。",
    statValue: "48h 热度拉升",
    statNote: "适合承担首页第一视觉、专题封面与运营主推位。",
    href: "/contents/mcdonalds-peony-building-campaign",
    paletteClass: "from-[#273f77] via-[#3d6f84] to-[#d3e6d9]",
  },
  {
    title: "观夏新品上市如何把东方场景叙事做得更轻",
    label: "品牌上新",
    partners: ["to summer", "QiuQiuTech"],
    tags: ["新品上市", "品牌叙事"],
    summary: "让首页主案例既能承接高视觉品牌内容，也不会把首屏做成纯海报展示。",
    statValue: "精选收录",
    statNote: "适合承接品牌稿、案例稿和高视觉项目型内容。",
    href: "/contents/weekly-marketing-cases-observation",
    paletteClass: "from-[#cabca7] via-[#f3ece4] to-[#ddd6cb]",
  },
];

const meta = {
  title: "Pages/Home Hero Carousel",
  component: HomeHeroCarousel,
  parameters: {
    layout: "padded",
  },
  args: {
    slides,
  },
} satisfies Meta<typeof HomeHeroCarousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="mx-auto max-w-7xl">
      <HomeHeroCarousel {...args} />
    </div>
  ),
};
