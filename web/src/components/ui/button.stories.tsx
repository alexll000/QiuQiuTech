import type { Meta, StoryObj } from "@storybook/nextjs";
import { ArrowRight, Bell, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "主要操作",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "次要操作",
  },
};

export const Soft: Story = {
  args: {
    variant: "soft",
    children: "筛选条件",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "删除内容",
  },
};

export const IconOnly: Story = {
  args: {
    size: "icon",
    "aria-label": "搜索",
    children: <Search className="size-4" />,
  },
};

export const ActionRow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>
        发布内容
        <ArrowRight className="size-4" />
      </Button>
      <Button variant="secondary">
        <Bell className="size-4" />
        通知中心
      </Button>
      <Button variant="soft">
        <Download className="size-4" />
        下载报告
      </Button>
    </div>
  ),
};
