import type {
  CmsRequestApplicationGuide,
  CmsSubmissionCenterData,
} from "@/lib/cms-types";

export async function getMockSubmissionCenterData(): Promise<CmsSubmissionCenterData> {
  return {
    submissionTypes: [
      {
        title: "提交案例",
        description: "分享你的产品案例、增长实践与成功经验",
        icon: "doc",
      },
      {
        title: "提交营销事件",
        description: "分享你的营销事件、创意策划与执行复盘",
        icon: "horn",
      },
      {
        title: "提交玩法拆解",
        description: "拆解平台玩法、运营策略与增长方法论",
        icon: "puzzle",
      },
    ],
    workflowSteps: [
      { step: "1", title: "填写内容信息", note: "选择投稿类型，填写内容信息并提交" },
      { step: "2", title: "平台审核", note: "内容团队进行审核与评估" },
      { step: "3", title: "内容上线", note: "审核通过后，内容将正式发布" },
    ],
    formFields: [
      { label: "投稿类型", value: "案例投稿", highlighted: true, required: true },
      { label: "标题", value: "请输入案例标题或事件名称", required: true },
      { label: "一句话摘要", value: "提炼亮点、结果与核心策略", required: true },
      { label: "头图素材", value: "建议 1600×900，保留清晰主体", required: true },
      { label: "标签", value: "发布时动态录入，支持品牌联名 / Campaign / 节点营销" },
      { label: "来源链接", value: "补充原始链接或品牌官网地址" },
    ],
    benefits: [
      { title: "影响力提升", note: "优质内容将获得更多曝光，扩大行业影响力" },
      { title: "专业认可", note: "获得平台认证与推荐，建立专业声誉" },
      { title: "专属福利", note: "优质创作者可获得平台专题福利与奖励" },
      { title: "连接行业", note: "与更多优秀创作者交流，拓展人脉与合作机会" },
    ],
    statusNotes: [
      { title: "草稿中", note: "可继续编辑并补充头图、摘要与标签" },
      { title: "待审核", note: "进入审核队列，等待平台确认完整性" },
      { title: "需补充", note: "素材尺寸或标签不完整，会返回修改建议" },
      { title: "已发布", note: "进入首页精选、专题位或内容推荐流" },
    ],
  };
}

export async function getMockRequestApplicationGuide(): Promise<CmsRequestApplicationGuide> {
  return {
    steps: [
      { title: "提交申请", note: "填写合作意向、团队简介与相关案例链接。" },
      { title: "等待确认", note: "对方或平台审核通过后，再进入联系方式互换。" },
      { title: "建立联系", note: "确认后进入后续沟通与合作推进阶段。" },
    ],
    safeguards: [
      { title: "联系方式保护", note: "未确认前默认不直接暴露联系方式。" },
      { title: "身份校验", note: "合作卡发布前优先校验基础身份与真实性。" },
      { title: "状态留痕", note: "申请、接受、连接与关闭都保留操作轨迹。" },
    ],
  };
}
