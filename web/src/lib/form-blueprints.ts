export type SessionResponse = {
  ok?: boolean;
  isLoggedIn?: boolean;
  userId?: string;
  message?: string;
};

export type SessionCreatePayload = {
  userId: string;
  displayName?: string;
  phone?: string;
  companyName?: string;
  city?: string;
  roleType?: "brand" | "marketer" | "agency" | "independent";
  authSource?: "password" | "code" | "wechat" | "register";
};

export const authFeatureNotes = [
  "把投稿、收藏和合作反馈留在同一个工作台",
  "让内容判断、行业关注与个人资料形成连续记录",
  "登录后可继续管理你的内容参与和合作进展",
];

export const authQrPattern = [
  "111001011100",
  "100101000101",
  "101111011101",
  "100001010001",
  "111101110111",
  "001010001010",
  "111011101110",
  "100010100001",
  "101110111101",
  "100000000101",
  "111011101111",
  "100101000001",
];

export const meQuickActions = [
  ["继续编辑草稿", "返回最近一次未提交内容"],
  ["发布合作需求", "进入合作对接广场"],
  ["查看审核结果", "统一回看驳回与通过记录"],
  ["维护个人资料", "补充身份与展示信息"],
];

export const meRecentActivities = [
  ["投稿已进入审核", "用户投稿：社媒热点如何被重组为节日营销内容。", "待审核"],
  ["合作申请有新反馈", "消费品牌寻线下联名快闪共创团队。", "等待对方确认"],
  ["专题推荐更新", "节点营销专题新增 6 条可参考内容。", "可立即查看"],
];

export const meProfileFacts = [
  { label: "显示身份", value: "品牌方 / 营销从业者 / 代理公司 / 独立操盘手。" },
  { label: "对外展示", value: "简介、擅长领域、合作偏好、所在城市与联系方式策略。" },
  { label: "认证升级", value: "后续可补企业认证、名片资料与合作案例证明。" },
];

export const meOverviewStats = [
  ["待审核投稿", "03"],
  ["合作申请中", "05"],
  ["待处理通知", "08"],
];
