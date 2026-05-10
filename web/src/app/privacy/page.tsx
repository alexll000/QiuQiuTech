import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "隐私政策",
  description: "QiuQiuTech 隐私政策，说明我们如何收集、使用、存储和保护您的个人信息。",
  path: "/privacy",
  noIndex: true,
});

type SubSection = {
  heading: string;
  items: string[];
};

type SectionWithSubSections = {
  title: string;
  subsections: SubSection[];
};

type SectionWithItems = {
  title: string;
  items: string[];
};

type Section = SectionWithSubSections | SectionWithItems;

const sections: Section[] = [
  {
    title: "一、我们收集的信息",
    subsections: [
      {
        heading: "1. 您主动提供的信息",
        items: [
          "注册/登录时提供的昵称、手机号、邮箱（如有）、所属机构、所在城市；",
          "投稿时提交的内容正文、封面图、标签及联系方式；",
          "发布合作需求时填写的需求描述、预算、周期、联系方式；",
          "您主动通过表单、评论、反馈渠道提交的其他信息。",
        ],
      },
      {
        heading: "2. 系统自动收集的信息",
        items: [
          "设备信息：设备型号、操作系统、浏览器类型及版本；",
          "日志信息：访问时间、访问页面、IP 地址、停留时长；",
          "Cookie 信息：用于维持登录状态、记录偏好设置及分析流量。",
        ],
      },
    ],
  },
  {
    title: "二、我们如何使用信息",
    items: [
      "提供、维护并改进平台服务，包括内容推荐、搜索排序与合作匹配；",
      "验证身份、保障账号安全、防止欺诈和滥用；",
      "向您发送服务通知、审核结果及与您账号相关的消息；",
      "进行数据分析，了解用户使用习惯，优化产品体验；",
      "在获得您单独同意的前提下，向您推送营销资讯或活动信息。",
    ],
  },
  {
    title: "三、信息的存储与保护",
    items: [
      "您的个人信息存储于中华人民共和国境内的服务器，不会跨境传输。",
      "我们采取符合行业标准的技术与管理措施保护您的个人信息，防止信息泄露、篡改或丢失。",
      "我们将在达成收集目的所必需的最短时间内保留您的个人信息，法律另有规定的除外。",
      "如发生个人信息安全事件，我们将按照法律规定及时通知您并向监管部门报告。",
    ],
  },
  {
    title: "四、信息共享与披露",
    items: [
      "我们不会向第三方出售您的个人信息。",
      "在以下情形下，我们可能共享您的信息：(1) 获得您的明确同意；(2) 与提供技术支持的服务商必要共享（该等服务商无权将信息用于其他目的）；(3) 依据法律法规或政府部门要求必须提供。",
      "如平台涉及合并、收购或资产转让，您的个人信息可能作为交易资产一并转移，我们将向您告知并继续受本政策约束。",
    ],
  },
  {
    title: "五、您的权利",
    items: [
      "查询与更正：您可随时登录账号查看并更正您的个人资料。",
      "删除：在以下情形下您可要求我们删除您的个人信息：处理目的已实现、您撤回同意、我们违反法律或协议约定处理您的信息。",
      "注销账号：您可申请注销账号，注销后我们将删除或匿名化处理您的个人信息，法律另有规定的除外。",
      "如您对个人信息处理有任何疑问或投诉，可通过平台公示的联系方式向我们提出，我们将在 15 个工作日内答复。",
    ],
  },
  {
    title: "六、未成年人保护",
    items: [
      "平台主要面向年满 18 周岁的营销从业者。",
      "我们不会主动向未成年人收集个人信息。如我们发现未成年人在未获监护人同意的情况下注册了账号，将及时删除相关信息。",
      "监护人如发现未成年人使用平台并提供了个人信息，请及时联系我们，我们将采取措施予以处理。",
    ],
  },
  {
    title: "七、本政策的更新",
    items: [
      "我们可能适时修订本隐私政策，修订后的版本将在平台公示并在生效前通过适当方式通知您。",
      "如本政策发生重大变更（如处理目的变更、信息类型变更等），我们将以显著方式通知您并再次征得您的同意。",
    ],
  },
  {
    title: "八、联系我们",
    items: [
      "如对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：",
      "邮箱：privacy@qiqute.ch（示例地址，正式上线前请替换为真实联系方式）",
      "我们将在收到您的请求后 15 个工作日内处理并答复。",
    ],
  },
];

function hasSubSections(s: Section): s is SectionWithSubSections {
  return "subsections" in s;
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[780px]">
        {/* 顶部 */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--copy-soft)] hover:text-[var(--teal)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            返回首页
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[var(--navy)]">
            隐私政策
          </h1>
          <p className="mt-2 text-sm text-[var(--copy-soft)]">
            最后更新：2026 年 5 月 9 日
          </p>
        </div>

        {/* 提示 */}
        <div className="mb-8 rounded-[var(--radius-md)] bg-[var(--teal-soft)]/60 border border-[var(--teal)]/20 px-5 py-4 text-sm text-[var(--teal-deep)] leading-relaxed">
          QiuQiuTech 高度重视您的个人信息保护。本政策将帮助您了解我们如何收集、使用、存储和保护您的信息，以及您享有的相关权利。
        </div>

        {/* 正文 */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-[var(--navy)] mb-3 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
                {section.title}
              </h2>

              {hasSubSections(section)
                ? (
                    <div className="space-y-5 pl-5">
                      {section.subsections.map((sub) => (
                        <div key={sub.heading}>
                          <h3 className="text-sm font-medium text-[var(--copy)] mb-1.5">{sub.heading}</h3>
                          <div className="space-y-1.5 pl-1">
                            {sub.items.map((item, i) => (
                              <p key={i} className="text-sm leading-[1.8] text-[var(--copy-soft)]">
                                {item}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                : (
                    <div className="space-y-2 pl-5">
                      {section.items.map((item, i) => (
                        <p key={i} className="text-sm leading-[1.8] text-[var(--copy)] pl-1">
                          {item}
                        </p>
                      ))}
                    </div>
                  )}
            </section>
          ))}
        </div>

        {/* 底部 */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex items-center justify-between">
          <p className="text-xs text-[var(--copy-muted)]">
            © 2026 QiuQiuTech · 内容与合作的精准连接
          </p>
          <Link href="/terms" className="text-sm text-[var(--teal)] hover:underline">
            查看使用协议 →
          </Link>
        </div>
      </div>
    </main>
  );
}
