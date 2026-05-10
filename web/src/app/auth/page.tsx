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
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#edf2f8_0%,#e8eef6_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(38,167,163,0.16),transparent_24%),radial-gradient(circle_at_86%_18%,rgba(255,202,40,0.16),transparent_18%),radial-gradient(circle_at_72%_76%,rgba(22,43,117,0.12),transparent_24%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1520px] items-center justify-center">
        <AuthModal />
      </div>
    </main>
  );
}
