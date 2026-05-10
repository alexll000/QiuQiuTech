"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { RequestApplicationPayload } from "@/lib/cms-types";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export function RequestApplicationForm({ slug }: { slug: string }) {
  const [intro, setIntro] = useState("希望进一步沟通合作方向与团队能力。");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [contactPreference, setContactPreference] = useState<
    RequestApplicationPayload["contactPreference"]
  >("apply_only");

  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleApply() {
    setPending(true);
    setMessage(null);
    try {
      const result = await postJson<{
        ok: boolean;
        message: string;
        applicationId?: string;
      }>(`/api/requests/${slug}/apply`, {
        intro,
        portfolioUrl: portfolioUrl ? portfolioUrl : undefined,
        contactPreference,
      });
      setMessage(result?.message || "申请已提交");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "申请失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <Field label="申请合作" required>
        <Textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className="min-h-[110px] resize-y"
        />
      </Field>

      <Field label="作品/案例链接（可选）">
        <Input
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder="https://...（用于对方快速评估你的能力）"
        />
      </Field>

      <Field label="联系方式策略">
        <Select
          value={contactPreference}
          onChange={(e) => {
            const value = e.target.value;
            if (
              value === "public" ||
              value === "apply_only" ||
              value === "platform_match"
            ) {
              setContactPreference(value);
            }
          }}
        >
          <option value="public">公开联系方式</option>
          <option value="apply_only">仅在确认后互换</option>
          <option value="platform_match">平台撮合后再互换</option>
        </Select>
      </Field>

      <Button
        onClick={handleApply}
        disabled={pending || !intro.trim()}
        className="w-full"
      >
        {pending ? "提交中..." : "提交申请"}
      </Button>

      {message ? (
        <div className="rounded-[18px] border border-[#d8efe9] bg-[#f4fbf8] px-4 py-3 text-sm font-medium text-teal">
          {message}
        </div>
      ) : null}
    </div>
  );
}
