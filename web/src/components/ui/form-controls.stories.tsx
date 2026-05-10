import type { Meta, StoryObj } from "@storybook/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormPanel } from "@/components/ui/form-shell";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "Primitives/Form Controls",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="mx-auto grid max-w-3xl gap-4">
      <FormPanel>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-navy-strong">基础录入模块</h3>
            <p className="mt-1 text-sm text-copy-soft">用同一套输入层次承接投稿、申请和资料补充。</p>
          </div>
          <Badge variant="info">默认态</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="投稿类型" required>
            <Select defaultValue="case">
              <option value="case">案例投稿</option>
              <option value="event">营销事件投稿</option>
              <option value="playbook">玩法拆解投稿</option>
            </Select>
          </Field>

          <Field label="标签（逗号分隔）">
            <Input placeholder="AI 营销，节点战役，品牌联动" />
          </Field>

          <Field label="标题" required className="md:col-span-2">
            <Input placeholder="写一个清楚、可发布的标题" />
          </Field>

          <Field label="一句话摘要" required className="md:col-span-2">
            <Textarea className="resize-y" placeholder="先说清楚这条内容最值得被看见的地方。" />
          </Field>
        </div>
      </FormPanel>
    </div>
  ),
};

export const ValidationAndStatus: Story = {
  render: () => (
    <div className="mx-auto grid max-w-3xl gap-4">
      <FormPanel>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-navy-strong">弱数据与反馈态</h3>
            <p className="mt-1 text-sm text-copy-soft">用来审按钮禁用、说明文案和结果反馈是否足够克制。</p>
          </div>
          <Badge variant="soft">提交成功</Badge>
        </div>

        <div className="space-y-4">
          <Field label="作品/案例链接（可选）">
            <Input value="https://portfolio.example.com/case" readOnly />
          </Field>

          <Field label="合作说明" required>
            <Textarea
              className="min-h-[110px] resize-y"
              value="希望进一步沟通合作方向与团队能力。"
              readOnly
            />
          </Field>

          <div className="flex flex-wrap items-center gap-3">
            <Button className="min-w-28">提交申请</Button>
            <Button variant="secondary" disabled className="min-w-28">
              保存中...
            </Button>
            <span className="text-sm font-medium text-teal">已保存草稿，稍后可继续编辑。</span>
          </div>
        </div>
      </FormPanel>
    </div>
  ),
};
