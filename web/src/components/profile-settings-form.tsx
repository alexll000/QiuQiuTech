"use client";

import { useState } from "react";
import type { CmsUserProfile, UpdateProfilePayload } from "@/lib/cms-types";

type ProfileResponse = {
  ok?: boolean;
  message?: string;
  source?: "directus" | "fallback";
  profile?: CmsUserProfile;
};

function withSource(message: string, source?: string) {
  if (source === "fallback") return `${message}（fallback）`;
  if (source === "directus") return `${message}（directus）`;
  return message;
}

export function ProfileSettingsForm({ profile }: { profile: CmsUserProfile }) {
  const [form, setForm] = useState<UpdateProfilePayload>({
    displayName: profile.displayName,
    roleType: profile.roleType,
    bio: profile.bio || "",
    city: profile.city || "",
    companyName: profile.companyName || "",
    contactPolicy: profile.contactPolicy || "apply_only",
  });
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  function updateField<K extends keyof UpdateProfilePayload>(key: K, value: UpdateProfilePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    try {
      setPending(true);
      setMessage("");
      const response = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as ProfileResponse;
      if (!response.ok || !result.ok) {
        setMessage(result.message || "资料更新失败，请稍后再试。");
        return;
      }

      if (result.profile) {
        setForm({
          displayName: result.profile.displayName,
          roleType: result.profile.roleType,
          bio: result.profile.bio || "",
          city: result.profile.city || "",
          companyName: result.profile.companyName || "",
          contactPolicy: result.profile.contactPolicy || "apply_only",
        });
      }
      setMessage(withSource(result.message || "资料已更新。", result.source));
    } catch {
      setMessage("资料更新失败，请检查本地服务后重试。");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6 border-t border-border pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy-strong">维护展示资料</p>
          <p className="mt-1 text-sm leading-6 text-copy-soft">
            当前先维护最小资料，后续再接头像、认证材料与更完整的公开展示信息。
          </p>
        </div>
        <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-xs font-medium text-navy-strong">
          {profile.verificationStatus === "verified"
            ? "已认证"
            : profile.verificationStatus === "pending"
              ? "审核中"
              : profile.verificationStatus === "rejected"
                ? "认证未通过"
                : "未认证"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">昵称</span>
          <input
            value={form.displayName}
            onChange={(event) => updateField("displayName", event.target.value)}
            className="mt-2 w-full rounded-[16px] border border-border bg-[#fbfcff] px-4 py-3 text-sm text-copy outline-none focus:border-teal"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">身份</span>
          <select
            value={form.roleType}
            onChange={(event) => updateField("roleType", event.target.value as UpdateProfilePayload["roleType"])}
            className="mt-2 w-full rounded-[16px] border border-border bg-[#fbfcff] px-4 py-3 text-sm text-copy outline-none focus:border-teal"
          >
            <option value="marketer">市场人</option>
            <option value="brand">品牌方</option>
            <option value="agency">代理公司</option>
            <option value="independent">独立操盘手</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">所属机构</span>
          <input
            value={form.companyName || ""}
            onChange={(event) => updateField("companyName", event.target.value)}
            className="mt-2 w-full rounded-[16px] border border-border bg-[#fbfcff] px-4 py-3 text-sm text-copy outline-none focus:border-teal"
            placeholder="可选填写"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">所在城市</span>
          <input
            value={form.city || ""}
            onChange={(event) => updateField("city", event.target.value)}
            className="mt-2 w-full rounded-[16px] border border-border bg-[#fbfcff] px-4 py-3 text-sm text-copy outline-none focus:border-teal"
            placeholder="可选填写"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">联系方式策略</span>
          <select
            value={form.contactPolicy || "apply_only"}
            onChange={(event) =>
              updateField("contactPolicy", event.target.value as UpdateProfilePayload["contactPolicy"])
            }
            className="mt-2 w-full rounded-[16px] border border-border bg-[#fbfcff] px-4 py-3 text-sm text-copy outline-none focus:border-teal"
          >
            <option value="apply_only">仅通过申请沟通</option>
            <option value="platform_match">平台撮合后沟通</option>
            <option value="public">公开展示</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">简介</span>
          <textarea
            value={form.bio || ""}
            onChange={(event) => updateField("bio", event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-[16px] border border-border bg-[#fbfcff] px-4 py-3 text-sm leading-7 text-copy outline-none focus:border-teal"
            placeholder="补充你的关注方向、擅长领域或合作偏好。"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-copy-soft">{message || "当前修改会优先写入 Directus，失败时保留 fallback 兜底。"}</p>
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={pending}
          className="rounded-full bg-navy-strong px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
        >
          {pending ? "保存中..." : "保存资料"}
        </button>
      </div>
    </div>
  );
}
