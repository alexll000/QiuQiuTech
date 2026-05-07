import { AuthModal } from "@/components/auth-modal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "登录与注册",
  description: "登录 QiuQiuTech，管理投稿、合作需求、收藏记录与个人资料。",
  path: "/auth",
  noIndex: true,
  keywords: ["QiuQiuTech 登录", "微信扫码登录", "注册账号", "投稿账号", "合作需求账号"],
});

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(38,167,163,0.08),transparent_28%),linear-gradient(180deg,rgba(243,245,248,0.96),rgba(236,241,248,1))] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1520px] items-center justify-center">
        <div className="absolute inset-0 bg-[rgba(11,18,46,0.46)]" />
        <AuthModal />
      </div>
    </main>
  );
}
