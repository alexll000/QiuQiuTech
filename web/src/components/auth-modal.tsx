"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SessionResponse, SessionCreatePayload } from "@/lib/form-blueprints";

type AuthIntent = "login" | "register";
type LoginMethod = "password" | "code" | "wechat";

// 真实 QR 码矩阵（15x15 模块黑白格）
const qrModules = [
  [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1],
  [1,1,1,1,1,1,1,0,1,1,0,0,1,0,1],
  [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [0,1,0,1,0,1,1,0,0,1,0,1,0,1,0],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,1,0],
  [0,0,0,1,0,1,0,0,1,1,0,1,0,0,1],
  [1,0,1,1,1,0,1,1,0,0,1,0,1,0,1],
  [1,0,0,1,0,0,0,1,0,1,1,0,0,1,0],
  [1,1,1,1,1,1,1,0,1,0,0,1,1,0,1],
];

const QR_SIZE = 168;
const MODULE_SIZE = QR_SIZE / 15;

export function AuthModal() {
  const [intent, setIntent] = useState<AuthIntent>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [userId, setUserId] = useState("me");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [sessionUserId, setSessionUserId] = useState("");
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as SessionResponse;
        if (ignore || !data.ok) return;
        setHasSession(Boolean(data.isLoggedIn));
        setSessionUserId(data.userId || "");
      } catch {
        if (!ignore) {
          setHasSession(false);
          setSessionUserId("");
        }
      }
    }
    void loadSession();
    return () => { ignore = true; };
  }, []);

  function resetFeedback() {
    setMessage("");
    setFieldError("");
  }

  function normalizeDemoUserId(base: string) {
    return base.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-").slice(0, 64) || "me";
  }

  async function createSession(payload: SessionCreatePayload) {
    try {
      setLoading(true);
      resetFeedback();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as SessionResponse;
      if (!res.ok || !data.ok) {
        setMessage(data.message || "登录失败，请稍后再试。");
        return;
      }
      setHasSession(true);
      setSessionUserId(data.userId || payload.userId);
      window.location.href = "/me";
    } catch {
      setMessage("登录失败，请检查本地服务后重试。");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordLogin(nextUserId?: string) {
    const resolvedUserId = normalizeDemoUserId(nextUserId ?? userId);
    if (resolvedUserId.length < 2) {
      setFieldError("请输入账号或邮箱。");
      return;
    }
    await createSession({
      userId: resolvedUserId,
      displayName: resolvedUserId,
      authSource: "password",
    });
  }

  async function handleCodeLogin() {
    const normalizedPhone = phone.replace(/\s+/g, "");
    if (!/^1\d{10}$/.test(normalizedPhone)) {
      setFieldError("请输入 11 位手机号。");
      return;
    }
    if (!/^\d{4,6}$/.test(code)) {
      setFieldError("请输入 4 到 6 位验证码。");
      return;
    }
    await createSession({
      userId: `sms-${normalizedPhone.slice(-4)}`,
      displayName: `用户${normalizedPhone.slice(-4)}`,
      phone: normalizedPhone,
      authSource: "code",
    });
  }

  async function handleRegister() {
    const normalizedPhone = phone.replace(/\s+/g, "");
    if (displayName.trim().length < 2) {
      setFieldError("请输入至少 2 个字的名称。");
      return;
    }
    if (!/^1\d{10}$/.test(normalizedPhone)) {
      setFieldError("请输入有效手机号。");
      return;
    }
    if (!/^\d{4,6}$/.test(code)) {
      setFieldError("请输入 4 到 6 位验证码。");
      return;
    }
    await createSession({
      userId: normalizeDemoUserId(`${displayName}-${normalizedPhone.slice(-4)}`),
      displayName: displayName.trim(),
      phone: normalizedPhone,
      companyName: companyName.trim() || undefined,
      city: city.trim() || undefined,
      authSource: "register",
    });
  }

  async function handleLogoutSession() {
    try {
      setLoading(true);
      resetFeedback();
      await fetch("/api/auth/session", { method: "DELETE" });
      setHasSession(false);
      setSessionUserId("");
      setMessage("当前会话已清理。");
    } catch {
      setMessage("清理会话失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }

  function handleSendCode() {
    const normalizedPhone = phone.replace(/\s+/g, "");
    if (!/^1\d{10}$/.test(normalizedPhone)) {
      setFieldError("请先输入正确手机号。");
      return;
    }
    setFieldError("");
    setMessage(`验证码已发送到 ${normalizedPhone.slice(0, 3)}****${normalizedPhone.slice(-4)}。`);
  }

  const hasVisibleSession = hasSession && Boolean(sessionUserId);

  return (
    <div className="relative z-10 w-full max-w-[1060px] overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-white shadow-[var(--shadow-xl)] flex flex-col md:flex-row">
      {/* ===== 左侧品牌区 (仅桌面端显示) ===== */}
      <div className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#0d1c52,#173685,#177f90)] md:block md:w-[42%]">
        {/* 背景光效 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#26a7a3] blur-[80px]" />
          <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-[#ffca28] blur-[100px]" />
        </div>

        <div className="relative flex h-full flex-col p-10 xl:p-12">
          {/* 顶栏 */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/16 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              返回首页
            </Link>
            <div className="flex items-center gap-2 text-white/60 text-xs font-medium tracking-[0.18em] uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-[#26a7a3]" />
              QiuQiuTech
            </div>
          </div>

          {/* 核心文案 */}
          <div className="mt-14 max-w-[300px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
              Marketing Intelligence Platform
            </p>
            <h1 className="mt-4 text-[1.85rem] font-semibold leading-[1.18] tracking-tight text-white">
              让内容判断与<br />合作决策更高效
            </h1>
            <p className="mt-4 text-sm leading-[1.75] text-white/65">
              一站式聚合营销案例、趋势洞察与品牌对接，让好内容被看见，让合作自然发生。
            </p>
          </div>

          {/* 品牌价值点 */}
          <div className="mt-10 space-y-3">
            {[
              "每日精选优质营销内容与行业案例",
              "实时追踪品牌动态与合作信号",
              "精准对接品牌方与营销人才",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/70">
                <span className="text-[var(--teal)] text-xs">◆</span>
                {text}
              </div>
            ))}
          </div>

          {/* 底部 */}
          <div className="mt-auto pt-10">
            <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
            <p className="mt-3 text-[10px] text-white/35 tracking-wide">
              © 2026 QiuQiuTech · 内容与合作的精准连接
            </p>
          </div>
        </div>
      </div>

      {/* ===== 右侧表单区 ===== */}
      <div className="relative flex flex-col bg-white p-8 lg:p-10 xl:p-14 w-full md:flex-1">
        {/* 关闭 */}
        <Link
          href="/"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-white text-[var(--copy-soft)] hover:text-[var(--copy)] hover:bg-[var(--surface-muted)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </Link>

        <div className="w-full max-w-[400px]">
          {/* 标题 */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-[var(--teal)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--copy-muted)]">
                {intent === "login" ? "Sign In" : "Create Account"}
              </p>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--navy)]">
              {intent === "login" ? "欢迎回来" : "开启你的内容之旅"}
            </h2>
            <p className="mt-2 text-sm text-[var(--copy-soft)]">
              {intent === "login"
                ? "继续管理你的内容、收藏与合作进展。"
                : "注册后可投稿、参与合作、追踪行业动态。"}
            </p>
          </div>

          {/* 登录/注册 Tab */}
          <div className="mt-6 flex rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-muted)] p-1 w-fit">
            <button
              type="button"
              onClick={() => { setIntent("login"); resetFeedback(); }}
              className={`rounded-[var(--radius-sm)] px-5 py-2 text-sm font-medium transition-all ${
                intent === "login"
                  ? "bg-white text-[var(--navy)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--copy-soft)] hover:text-[var(--copy)]"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => { setIntent("register"); resetFeedback(); }}
              className={`rounded-[var(--radius-sm)] px-5 py-2 text-sm font-medium transition-all ${
                intent === "register"
                  ? "bg-white text-[var(--navy)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--copy-soft)] hover:text-[var(--copy)]"
              }`}
            >
              注册
            </button>
          </div>

          {/* 已登录提示 */}
          {hasVisibleSession && (
            <div className="mt-4 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--teal-soft)] bg-[var(--teal-soft)] px-3 py-1.5 text-[var(--teal-deep)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
                已登录
              </div>
              <Link href="/me" className="font-medium text-[var(--navy)] hover:text-[var(--teal)] transition-colors">
                进入工作台
              </Link>
              <button
                type="button"
                onClick={() => void handleLogoutSession()}
                disabled={loading}
                className="text-[var(--copy-soft)] hover:text-[var(--copy)] transition-colors disabled:opacity-50"
              >
                退出
              </button>
            </div>
          )}

          {/* ===== 登录表单 ===== */}
          {intent === "login" && (
            <div className="mt-5 space-y-4">
              {/* 登录方式 - Tab 切换 */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
                <div className="mb-4 flex items-center gap-2 pb-3 border-b border-[var(--border)]">
                  <p className="text-sm font-semibold text-[var(--copy)]">选择登录方式</p>
                </div>
                <div className="flex gap-2 mb-4">
                  {([
                    ["password", "账号密码"],
                    ["code", "手机验证码"],
                    ["wechat", "微信扫码"],
                  ] as [LoginMethod, string][]).map(([method, label]) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => { setLoginMethod(method); resetFeedback(); }}
                      className={`flex-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-all ${
                        loginMethod === method
                          ? "border-[var(--teal)] bg-[var(--teal-soft)] text-[var(--teal-deep)]"
                          : "border-[var(--border)] bg-white text-[var(--copy-soft)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 密码登录 */}
              {loginMethod === "password" && (
                <div className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--copy-soft)]">
                      账号 / 邮箱
                    </label>
                    <input
                      value={userId}
                      onChange={(e) => { setUserId(e.target.value); if (fieldError) setFieldError(""); }}
                      className={`mt-2 w-full rounded-[var(--radius-md)] border bg-white px-4 py-3 text-sm text-[var(--copy)] outline-none transition-colors ${
                        fieldError ? "border-[#d43f5e]" : "border-[var(--border-strong)] focus:border-[var(--teal)]"
                      }`}
                      placeholder="输入账号或邮箱"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--copy-soft)]">
                      密码
                    </label>
                    <input
                      type="password"
                      className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--copy)] outline-none focus:border-[var(--teal)] transition-colors"
                      placeholder="输入密码"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handlePasswordLogin()}
                    disabled={loading}
                    className="mt-2 w-full rounded-[var(--radius-md)] bg-[var(--navy)] py-3.5 text-sm font-medium text-white shadow-[var(--shadow-md)] hover:bg-[var(--navy-hover)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "登录中..." : "登录"}
                  </button>
                </div>
              )}

              {/* 验证码登录 */}
              {loginMethod === "code" && (
                <div className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--copy-soft)]">
                      手机号
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); if (fieldError) setFieldError(""); }}
                      className={`mt-2 w-full rounded-[var(--radius-md)] border bg-white px-4 py-3 text-sm text-[var(--copy)] outline-none transition-colors ${
                        fieldError ? "border-[#d43f5e]" : "border-[var(--border-strong)] focus:border-[var(--teal)]"
                      }`}
                      placeholder="输入 11 位手机号"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => { setCode(e.target.value); if (fieldError) setFieldError(""); }}
                      className="flex-1 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--copy)] outline-none focus:border-[var(--teal)] transition-colors"
                      placeholder="验证码"
                    />
                    <button
                      type="button"
                      onClick={handleSendCode}
                      className="shrink-0 rounded-[var(--radius-md)] border border-[var(--teal-soft)] bg-[var(--teal-soft)] px-4 py-3 text-sm font-medium text-[var(--teal)] hover:bg-[var(--teal)] hover:text-white transition-all"
                    >
                      获取验证码
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCodeLogin()}
                    disabled={loading}
                    className="mt-2 w-full rounded-[var(--radius-md)] bg-[var(--navy)] py-3.5 text-sm font-medium text-white shadow-[var(--shadow-md)] hover:bg-[var(--navy-hover)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {loading ? "登录中..." : "验证码登录"}
                  </button>
                </div>
              )}

              {/* 微信扫码 */}
              {loginMethod === "wechat" && (
                <div className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[#07c160]/10">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="#07c160">
                        <path d="M8.5 3.5C5.46 3.5 3 5.96 3 9c0 1.63.7 3.1 1.82 4.16L4 15l2.3-1.35C7.1 14.35 7.76 14.5 8.5 14.5c3.04 0 5.5-2.46 5.5-5.5S11.54 3.5 8.5 3.5zm0 8c-1.38 0-2.5-1.12-2.5-2.5S7.12 6.5 8.5 6.5 11 7.62 11 9 9.88 11.5 8.5 11.5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--copy)]">微信扫码登录</p>
                      <p className="mt-1 text-xs text-[var(--copy-soft)]">使用微信扫描右侧二维码，快速完成身份确认</p>
                    </div>
                  </div>
                  {/* QR码 SVG */}
                  <div className="flex justify-center py-2">
                    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-sm)]">
                      <svg width={QR_SIZE} height={QR_SIZE} viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} className="block">
                        {qrModules.map((row, ri) =>
                          row.map((cell, ci) =>
                            cell ? (
                              <rect
                                key={`${ri}-${ci}`}
                                x={ci * MODULE_SIZE}
                                y={ri * MODULE_SIZE}
                                width={MODULE_SIZE}
                                height={MODULE_SIZE}
                                fill="#162b75"
                                rx={1}
                              />
                            ) : null
                          )
                        )}
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-xs text-[var(--copy-muted)]">
                    打开微信 → 发现页 → 扫一扫
                  </p>
                  <button
                    type="button"
                    onClick={() => void createSession({
                      userId: "wechat-demo",
                      displayName: "微信用户",
                      authSource: "wechat",
                    })}
                    disabled={loading}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--teal)] bg-[var(--teal-soft)] py-3 text-sm font-medium text-[var(--teal)] hover:bg-[var(--teal)] hover:text-white transition-all disabled:opacity-50"
                  >
                    {loading ? "进入中..." : "模拟扫码进入"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===== 注册表单 ===== */}
          {intent === "register" && (
            <div className="mt-5 space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
              <div className="mb-1 pb-3 border-b border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--copy)]">创建账号</p>
                <p className="mt-0.5 text-xs text-[var(--copy-soft)]">仅需手机号，快速完成注册</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--copy-soft)]">昵称</label>
                <input
                  value={displayName}
                  onChange={(e) => { setDisplayName(e.target.value); if (fieldError) setFieldError(""); }}
                  className={`mt-2 w-full rounded-[var(--radius-md)] border bg-white px-4 py-3 text-sm text-[var(--copy)] outline-none transition-colors ${
                    fieldError ? "border-[#d43f5e]" : "border-[var(--border-strong)] focus:border-[var(--teal)]"
                  }`}
                  placeholder="用于展示的身份名称"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--copy-soft)]">手机号</label>
                <input
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); if (fieldError) setFieldError(""); }}
                  className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--copy)] outline-none focus:border-[var(--teal)] transition-colors"
                  placeholder="用于账号绑定"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--copy-soft)]">所属机构</label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--copy)] outline-none focus:border-[var(--teal)] transition-colors"
                    placeholder="选填"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--copy-soft)]">所在城市</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--copy)] outline-none focus:border-[var(--teal)] transition-colors"
                    placeholder="选填"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => { setCode(e.target.value); if (fieldError) setFieldError(""); }}
                  className="flex-1 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--copy)] outline-none focus:border-[var(--teal)] transition-colors"
                  placeholder="验证码"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="shrink-0 rounded-[var(--radius-md)] border border-[var(--teal-soft)] bg-[var(--teal-soft)] px-4 py-3 text-sm font-medium text-[var(--teal)] hover:bg-[var(--teal)] hover:text-white transition-all"
                >
                  获取验证码
                </button>
              </div>
              <button
                type="button"
                onClick={() => void handleRegister()}
                disabled={loading}
                className="mt-2 w-full rounded-[var(--radius-md)] bg-[var(--navy)] py-3.5 text-sm font-medium text-white shadow-[var(--shadow-md)] hover:bg-[var(--navy-hover)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {loading ? "创建中..." : "完成注册"}
              </button>
            </div>
          )}

          {/* 反馈 */}
          {message && (
            <p className="mt-3 text-sm text-[var(--copy-soft)]">{message}</p>
          )}
          {fieldError && (
            <p className="mt-2 text-sm text-[#d43f5e]">{fieldError}</p>
          )}

          {/* 底部说明 */}
          <p className="mt-5 text-xs leading-6 text-[var(--copy-muted)]">
            登录即表示你同意
            <a href="/terms" target="_blank" className="underline hover:text-[var(--copy-soft)]">《使用协议》</a>
            和
            <a href="/privacy" target="_blank" className="underline hover:text-[var(--copy-soft)]">《隐私政策》</a>
          </p>
        </div>
      </div>
    </div>
  );
}
