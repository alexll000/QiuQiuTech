import type { Meta, StoryObj } from "@storybook/nextjs";
import { RequestApplicationForm } from "@/components/request-application-form";
import { SubmissionDraftForm } from "@/components/submission-draft-form";
import type { CmsSubmissionCenterData } from "@/lib/cms-types";

const submissionCenter: CmsSubmissionCenterData = {
  submissionTypes: [
    { title: "案例投稿", description: "品牌案例、节点战役和内容打法。", icon: "doc" },
    { title: "营销事件投稿", description: "事件营销、联名活动和线下传播。", icon: "horn" },
    { title: "玩法拆解投稿", description: "策略、机制、渠道与执行打法。", icon: "puzzle" },
  ],
  formFields: [
    { label: "标题", value: "例如：麦当劳如何把芍药季做成城市内容事件", required: true },
    { label: "一句话摘要", value: "先概括最值得行业参考的洞察或打法。", required: true },
    { label: "标签", value: "品牌联名，节日营销，线下快闪" },
    { label: "来源链接", value: "https://example.com/source" },
  ],
  workflowSteps: [],
  benefits: [],
  statusNotes: [],
};

const meta = {
  title: "Pages/Forms Workbench",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const SubmissionDraft: Story = {
  render: () => (
    <div className="mx-auto max-w-5xl">
      <SubmissionDraftForm submissionCenter={submissionCenter} />
    </div>
  ),
};

export const RequestApplication: Story = {
  render: () => (
    <div className="mx-auto max-w-xl rounded-[28px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">Application flow</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-strong">合作申请表单状态</h2>
        <p className="mt-2 text-sm leading-7 text-copy-soft">
          这页用于单独审申请动作层，不必每次都回到合作详情页里看。
        </p>
      </div>
      <RequestApplicationForm slug="brand-looking-for-popup-cocreation-team" />
    </div>
  ),
};
