import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "使用协议",
  description: "QiuQiuTech 平台使用协议，约定用户与平台之间的权利与义务。",
  path: "/terms",
  noIndex: true,
});

const sections = [
  {
    title: "一、总则",
    items: [
      `QiuQiuTech（以下简称"平台"）是为营销从业者提供内容聚合、案例参考与品牌对接服务的数字平台。`,
      "本协议适用于所有访问或使用本平台的用户。使用平台服务即视为已阅读并同意本协议全部条款。",
      "平台有权根据需要修改本协议，修改后的协议将在平台公示后生效。继续使用服务视为接受修改后的协议。",
    ],
  },
  {
    title: "二、账号注册与管理",
    items: [
      "用户需提供真实、准确、完整的注册信息，并及时更新。因信息不实导致的后果由用户自行承担。",
      "用户应妥善保管账号及密码，账号下的一切行为均视为用户本人操作，由此产生的后果由用户承担。",
      "用户不得将自己账号转让、出借或授权给他人使用。如发现账号异常，应立即通知平台。",
      "平台有权对因违反本协议或其他不合理使用行为的账号进行暂停或注销处理。",
    ],
  },
  {
    title: "三、内容投稿与知识产权",
    items: [
      "用户投稿的内容（包括案例、事件、玩法拆解等）应为用户原创或已获得合法授权，不侵犯任何第三方的知识产权或其他合法权益。",
      "用户投稿即表示同意平台对投稿内容进行审核、编辑、格式化及在平台范围内展示使用。",
      "平台尊重知识产权，如认为平台内容侵犯了您的合法权益，请按平台公示的投诉渠道联系我们，我们将依法处理。",
      "平台有权拒绝发布或删除违反法律法规、公序良俗或本协议约定的内容。",
    ],
  },
  {
    title: "四、合作对接行为规范",
    items: [
      "用户在平台发布合作需求或申请合作时，应提供真实、准确的信息，不得虚假陈述或误导对方。",
      "平台仅提供信息展示与对接渠道，不对合作双方的资质、履约能力及合作结果作担保。",
      "用户通过平台达成的合作，相关权利义务由合作双方自行约定，平台不承担合作纠纷中的任何责任。",
      "禁止在合作对接过程中从事欺诈、骚扰、恶意竞价等不当行为，平台有权对违规用户采取限制措施。",
    ],
  },
  {
    title: "五、免责声明",
    items: [
      "平台内容仅供参考学习之用，平台不对内容的准确性、完整性、时效性作任何明示或暗示的保证。",
      "用户因使用平台服务而产生的任何直接或间接损失，平台不承担责任，但法律另有规定的除外。",
      "平台不保证服务不会中断或不存在错误，对于因系统维护、升级、网络故障等原因导致的服务暂停不承担责任。",
    ],
  },
  {
    title: "六、协议终止",
    items: [
      "用户可随时申请注销账号，注销后账号相关信息将按照《隐私政策》的约定进行处理。",
      "平台有权在用户违反本协议时，不经通知直接终止提供服务并注销账号。",
      "协议终止后，平台仍需依照法律或本协议约定继续使用的信息，将继续按照《隐私政策》处理。",
    ],
  },
  {
    title: "七、其他",
    items: [
      "本协议的解释、效力及纠纷解决，适用中华人民共和国法律。",
      "因本协议引起的或与本协议有关的任何争议，双方应友好协商解决；协商不成的，任何一方可向平台运营方所在地人民法院提起诉讼。",
      "本协议自用户开始使用平台服务之日起生效。",
    ],
  },
];

export default function TermsPage() {
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
            使用协议
          </h1>
          <p className="mt-2 text-sm text-[var(--copy-soft)]">
            最后更新：2026 年 5 月 9 日
          </p>
        </div>

        {/* 提示 */}
        <div className="mb-8 rounded-[var(--radius-md)] bg-[var(--teal-soft)]/60 border border-[var(--teal)]/20 px-5 py-4 text-sm text-[var(--teal-deep)] leading-relaxed">
          使用 QiuQiuTech 平台即表示您已阅读并同意本协议。如您未满 18 周岁，请在法定监护人陪同下阅读并决定是否接受本协议。
        </div>

        {/* 正文 */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-[var(--navy)] mb-3 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
                {section.title}
              </h2>
              <div className="space-y-2.5 pl-5">
                {section.items.map((item, i) => (
                  <p key={i} className="text-sm leading-[1.8] text-[var(--copy)] pl-1">
                    {item}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 底部 */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex items-center justify-between">
          <p className="text-xs text-[var(--copy-muted)]">
            © 2026 QiuQiuTech · 内容与合作的精准连接
          </p>
          <Link href="/privacy" className="text-sm text-[var(--teal)] hover:underline">
            查看隐私政策 →
          </Link>
        </div>
      </div>
    </main>
  );
}
