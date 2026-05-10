import type { Meta, StoryObj } from "@storybook/nextjs";
import { SiteSearchForm } from "@/components/site-search-form";

const meta = {
  title: "Patterns/Site Search Form",
  component: SiteSearchForm,
  parameters: {
    layout: "padded",
  },
  args: {
    initialValue: "",
  },
} satisfies Meta<typeof SiteSearchForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  render: (args) => (
    <div className="mx-auto max-w-xl">
      <SiteSearchForm {...args} />
    </div>
  ),
};

export const WithKeyword: Story = {
  args: {
    initialValue: "麦当劳 芍药 campaign",
  },
  render: (args) => (
    <div className="mx-auto max-w-xl">
      <SiteSearchForm {...args} />
    </div>
  ),
};

export const MobileHint: Story = {
  args: {
    placeholder: "搜索内容 / 专题 / 合作需求",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: (args) => (
    <div className="mx-auto max-w-sm">
      <SiteSearchForm {...args} />
    </div>
  ),
};
