import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  ActionRow,
  DirectoryCard,
  FilterChips,
  InsightPanel,
  MetaList,
  PageHero,
  PrimaryButton,
  RailCard,
  SecondaryButton,
} from "@/components/platform-ui";

const meta = {
  title: "Patterns/Platform UI",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const HeroAndRail: Story = {
  render: () => (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHero
        eyebrow="Content intelligence"
        title="把首页、内容中心和合作链路拆成可审查的页面状态"
        description="这组故事用于固定 QiuQiuTech 的公开前台语言、层级与卡片风格，避免每次改动都重新发明一套界面。"
        actions={
          <ActionRow>
            <PrimaryButton href="/" label="查看首页方向" />
            <SecondaryButton href="/contents" label="查看内容中心" />
          </ActionRow>
        }
        aside={
          <>
            <RailCard
              title="适合审什么"
              body="首页 Hero、频道卡片、标签密度、按钮优先级、辅助说明长度。"
              tone="strong"
            />
            <RailCard
              title="适合改什么"
              body="组件边距、标题尺寸、文案长度、卡片层次、状态反馈，而不是临时拼新样式。"
            />
          </>
        }
      />
    </div>
  ),
};

export const CardsAndFilters: Story = {
  render: () => (
    <div className="mx-auto grid max-w-6xl gap-6">
      <FilterChips
        items={["全部", "品牌案例", "平台观察", "投放方法", "合作招募", "榜单追踪"]}
        activeIndex={2}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <DirectoryCard
          label="专题策展"
          title="内容栏目结构"
          description="固定卡片比例、元信息密度与文案长度，减少列表页一改就散。"
          meta="列表页 / 详情页 / 推荐位"
          accent="strong"
        />
        <DirectoryCard
          label="合作对接"
          title="申请动作层"
          description="把 CTA 主次、联系方式保护、状态反馈先做成稳定模式。"
          meta="申请 / 收藏 / 审核"
          accent="soft"
        />
        <DirectoryCard
          label="运营后台"
          title="最小审查台"
          description="后台先围绕队列、报告、处理动作做高密度布局，不做装饰型模块。"
          meta="审核 / 批量处理 / 批次报告"
        />
      </div>
    </div>
  ),
};

export const InsightAndMeta: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl">
      <InsightPanel
        title="UI 审核基线"
        description="这个故事专门用来检查文字密度、列表节奏和信息分组是否足够克制。"
      >
        <div className="grid gap-6 md:grid-cols-[1.4fr_0.8fr]">
          <MetaList
            items={[
              {
                label: "优先看",
                value: "标题长度、辅助说明是否一屏可扫完、按钮是否只有一个明显主操作。",
              },
              {
                label: "次优先看",
                value: "边框、圆角、阴影、标签样式是否仍属于同一套品牌语言。",
              },
              {
                label: "不要做",
                value: "为了显得高级而加更多装饰层、炫光层和无意义说明文案。",
              },
            ]}
          />
          <div className="space-y-4">
            <RailCard
              title="桌面端"
              body="优先检查导航密度、卡片高度一致性、Hero 与内容区是否争抢焦点。"
              tone="strong"
            />
            <RailCard
              title="移动端"
              body="优先检查文本换行、按钮可点击面积、筛选条是否溢出。"
            />
          </div>
        </div>
      </InsightPanel>
    </div>
  ),
};
