"use client";

import { useState } from "react";
import type { RequestDraftPayload, RequestType } from "@/lib/cms-types";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

const requestTypeOptions: Array<{ value: RequestType; label: string }> = [
  { value: "brand_to_marketer", label: "品牌找营销人" },
  { value: "brand_to_brand", label: "品牌找品牌" },
  { value: "marketer_to_partner", label: "营销人找合作方" },
  { value: "agency_collab", label: "代理公司 / 工作室合作" },
  { value: "platform_match", label: "平台撮合专区" },
];

export function RequestDraftForm() {
  const [title, setTitle] = useState("");
  const [requestType, setRequestType] =
    useState<RequestType>("brand_to_marketer");
  const [summary, setSummary] = useState("");
  const [city, setCity] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [targetType, setTargetType] = useState("");
  const [contactPolicy, setContactPolicy] =
    useState<RequestDraftPayload["contactPolicy"]>("apply_only");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSaveDraft() {
    setPending(true);
    setMessage(null);
    try {
      const result = await postJson<{
        ok: boolean;
        message: string;
        draftId?: string;
      }>("/api/requests/drafts", {
        title,
        requestType,
        summary,
        city: city || undefined,
        budgetRange: budgetRange || undefined,
        contactPolicy,
        targetType: targetType || undefined,
      });
      setMessage(result?.message || "已保存合作需求草稿。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-border bg-white p-5 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">
        Publish Request
      </p>
      <h2 className="mt-3 text-[1.6rem] font-semibold tracking-tight text-navy-strong">
        发布合作需求（草稿）
      </h2>

      <div className="mt-5 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="需求标题（必填）"
          className="w-full rounded-[14px] border border-border bg-white px-4 py-3 text-sm text-navy-strong"
        />
        <select
          value={requestType}
          onChange={(e) => setRequestType(e.target.value as RequestType)}
          className="w-full rounded-[14px] border border-border bg-white px-4 py-3 text-sm text-navy-strong"
        >
          {requestTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="需求摘要（必填）"
          className="min-h-[96px] w-full resize-y rounded-[14px] border border-border bg-white px-4 py-3 text-sm text-navy-strong"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="城市"
            className="w-full rounded-[14px] border border-border bg-white px-4 py-3 text-sm text-navy-strong"
          />
          <input
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            placeholder="预算区间"
            className="w-full rounded-[14px] border border-border bg-white px-4 py-3 text-sm text-navy-strong"
          />
        </div>
        <input
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
          placeholder="目标合作对象（如：新消费品牌 / 内容团队）"
          className="w-full rounded-[14px] border border-border bg-white px-4 py-3 text-sm text-navy-strong"
        />
        <select
          value={contactPolicy}
          onChange={(e) =>
            setContactPolicy(
              e.target.value as RequestDraftPayload["contactPolicy"],
            )
          }
          className="w-full rounded-[14px] border border-border bg-white px-4 py-3 text-sm text-navy-strong"
        >
          <option value="public">公开联系方式</option>
          <option value="apply_only">仅申请后互换</option>
          <option value="platform_match">平台撮合</option>
        </select>
      </div>

      <button
        onClick={handleSaveDraft}
        disabled={pending || !title.trim() || !summary.trim()}
        className="mt-4 w-full rounded-full bg-navy-strong px-4 py-3 text-sm font-medium text-white disabled:opacity-70"
      >
        {pending ? "保存中..." : "保存合作需求草稿"}
      </button>

      {message ? (
        <p className="mt-3 text-sm font-medium text-teal">{message}</p>
      ) : null}
    </section>
  );
}

