import type { Meta, StoryObj } from "@storybook/nextjs";
import { SiteSearchPanel } from "@/components/site-search-panel";

const meta = {
  title: "Patterns/Site Search Panel",
  component: SiteSearchPanel,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SiteSearchPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="mx-auto flex max-w-4xl justify-end bg-[#f7f7f5] p-10">
      <SiteSearchPanel {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: (args) => (
    <div className="mx-auto flex max-w-sm justify-end bg-[#f7f7f5] p-4">
      <SiteSearchPanel {...args} />
    </div>
  ),
};
