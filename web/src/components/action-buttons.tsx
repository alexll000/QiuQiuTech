"use client";

import { useState } from "react";
import type { ToggleSavedItemPayload } from "@/lib/cms-types";

async function postJson(url: string, body?: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function withSource(message: string, source?: string) {
  if (source === "fallback") return `${message}（fallback）`;
  if (source === "directus") return `${message}（directus）`;
  return message;
}

export function FavoriteButton({
  targetType,
  targetId,
  title,
  href,
}: ToggleSavedItemPayload) {
  const [label, setLabel] = useState("收藏");
  const [pending, setPending] = useState(false);

  async function handleClick() {
    try {
      setPending(true);
      const result = await postJson("/api/me/saved-items/toggle", {
        targetType,
        targetId,
        title,
        href,
      });
      setLabel(withSource(result?.message || "收藏已更新", result?.source));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-full bg-navy-strong px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
    >
      {pending ? "处理中..." : label}
    </button>
  );
}

export function SaveDraftButton() {
  const [label, setLabel] = useState("保存草稿");
  const [pending, setPending] = useState(false);

  async function handleClick() {
    try {
      setPending(true);
      const result = await postJson("/api/submissions/drafts", {
        submissionType: "case",
        title: "案例投稿草稿",
        summary: "待补充摘要",
        tags: ["案例投稿"],
      });
      setLabel(withSource(result?.message || "草稿已保存", result?.source));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-navy-strong disabled:opacity-70"
    >
      {pending ? "保存中..." : label}
    </button>
  );
}

export function ApplyRequestButton({ slug }: { slug: string }) {
  const [label, setLabel] = useState("申请合作");
  const [pending, setPending] = useState(false);

  async function handleClick() {
    try {
      setPending(true);
      const result = await postJson(`/api/requests/${slug}/apply`, {
        intro: "希望进一步沟通合作方向与团队能力。",
        portfolioUrl: "/me",
        contactPreference: "apply_only",
      });
      setLabel(withSource(result?.message || "已提交申请", result?.source));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="w-full rounded-full bg-navy-strong px-4 py-3 text-center text-sm font-medium text-white disabled:opacity-70"
    >
      {pending ? "提交中..." : label}
    </button>
  );
}

export function MarkNotificationReadButton() {
  const [label, setLabel] = useState("标记全部已读");
  const [pending, setPending] = useState(false);

  async function handleClick() {
    try {
      setPending(true);
      const result = await postJson("/api/me/notifications/read");
      setLabel(withSource(result?.message || "已标记", result?.source));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-navy-strong disabled:opacity-70"
    >
      {pending ? "处理中..." : label}
    </button>
  );
}

export function LogoutButton() {
  const [label, setLabel] = useState("退出登录");
  const [pending, setPending] = useState(false);

  async function handleClick() {
    try {
      setPending(true);
      const response = await fetch("/api/auth/session", { method: "DELETE" });
      if (!response.ok) {
        setLabel("退出失败");
        return;
      }
      setLabel("已退出");
      window.location.href = "/auth";
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm disabled:opacity-70"
    >
      {pending ? "处理中..." : label}
    </button>
  );
}
