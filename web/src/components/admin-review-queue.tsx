"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublishStatus } from "@/lib/cms-types";
import type { AdminReviewAction } from "@/lib/admin-review-service";

type ReviewTarget = "submissions" | "requests";

interface ReviewItem {
  id: string;
  title: string;
  summary: string;
  status: PublishStatus;
  reviewNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface ReviewApiResult {
  success: boolean;
  message: string;
  status?: PublishStatus;
  note?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  fallback?: boolean;
}

interface QueueApiResult {
  success: boolean;
  items: ReviewItem[];
  fallback?: boolean;
  message?: string;
}

const TARGET_LABEL: Record<ReviewTarget, string> = {
  submissions: "投稿",
  requests: "合作需求",
};

const STATUS_LABEL: Record<PublishStatus, string> = {
  draft: "草稿",
  pending_review: "待审核",
  under_review: "审核中",
  approved: "已通过",
  rejected: "已拒绝",
  published: "已发布",
  closed: "已关闭",
  archived: "已归档",
};

function canRunAction(status: PublishStatus, action: AdminReviewAction): boolean {
  if (action === "submit_review") return status === "draft" || status === "rejected";
  if (action === "approve") return status === "pending_review" || status === "under_review";
  if (action === "reject") return status === "pending_review" || status === "under_review";
  if (action === "publish") return status === "approved";
  return false;
}

function formatTime(value?: string): string {
  if (!value) return "未操作";
  try {
    return new Date(value).toLocaleString("zh-CN", { hour12: false });
  } catch {
    return value;
  }
}

export function AdminReviewQueue() {
  const PAGE_SIZE = 4;
  const [activeTarget, setActiveTarget] = useState<ReviewTarget>("submissions");
  const [statusFilter, setStatusFilter] = useState<PublishStatus | "all">("pending_review");
  const [currentPage, setCurrentPage] = useState(1);
  const [submissions, setSubmissions] = useState<ReviewItem[]>([]);
  const [requests, setRequests] = useState<ReviewItem[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkPending, setBulkPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [operationLogs, setOperationLogs] = useState<
    Array<{ id: string; target: string; action: string; result: string; at: string; note?: string; reviewer?: string }>
  >([]);

  const rawItems = useMemo(
    () => (activeTarget === "submissions" ? submissions : requests),
    [activeTarget, requests, submissions],
  );
  const filteredItems = useMemo(
    () => rawItems.filter((item) => (statusFilter === "all" ? true : item.status === statusFilter)),
    [rawItems, statusFilter],
  );
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const items = useMemo(
    () => filteredItems.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE),
    [filteredItems, safeCurrentPage, PAGE_SIZE],
  );

  useEffect(() => {
    async function loadQueue() {
      setLoading(true);
      try {
        const endpoint =
          activeTarget === "submissions"
            ? "/api/admin/submissions/review-queue"
            : "/api/admin/requests/review-queue";
        const statusQuery =
          statusFilter === "all" ? "" : `?status=${encodeURIComponent(statusFilter)}`;
        const response = await fetch(`${endpoint}${statusQuery}`, { method: "GET" });
        const result = (await response.json()) as QueueApiResult;

        if (!response.ok || !result.success) {
          setFeedback({ kind: "error", text: "审核队列加载失败。" });
          return;
        }

        if (activeTarget === "submissions") {
          setSubmissions(result.items || []);
        } else {
          setRequests(result.items || []);
        }

        if (result.fallback) {
          setFeedback({
            kind: "success",
            text: result.message || "当前展示的是临时审核队列。",
          });
        }
      } catch {
        setFeedback({ kind: "error", text: "审核队列加载失败，请稍后重试。" });
      } finally {
        setLoading(false);
      }
    }

    void loadQueue();
  }, [activeTarget, statusFilter]);

  function toggleSelected(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id],
    );
  }

  function toggleSelectPage() {
    const pageIds = items.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
      return;
    }
    setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
  }

  async function runAction(item: ReviewItem, action: AdminReviewAction) {
    const endpoint =
      activeTarget === "submissions"
        ? `/api/admin/submissions/${encodeURIComponent(item.id)}/review`
        : `/api/admin/requests/${encodeURIComponent(item.id)}/review`;

    setBusyId(item.id);
    setFeedback(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: reviewNote.trim() || `admin-ui:${action}` }),
      });
      const result = (await response.json()) as ReviewApiResult;

      if (!response.ok || !result.success) {
        setFeedback({
          kind: "error",
          text: result.message || "操作失败，请稍后重试。",
        });
        return;
      }

      const now = result.reviewedAt || new Date().toISOString();
      const nextStatus = result.status || item.status;
      const nextReviewer = result.reviewedBy || item.reviewedBy || "system-review";
      const nextNote = result.note || reviewNote.trim() || item.reviewNote;
      const updater = (list: ReviewItem[]) =>
        list.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                status: nextStatus,
                reviewNote: nextNote,
                reviewedAt: now,
                reviewedBy: nextReviewer,
              }
            : entry,
        );

      if (activeTarget === "submissions") {
        setSubmissions((prev) => updater(prev));
      } else {
        setRequests((prev) => updater(prev));
      }

      setFeedback({
        kind: "success",
        text: result.fallback
          ? `${result.message}（当前为临时状态）`
          : result.message,
      });
      setOperationLogs((prev) => [
        {
          id: `${item.id}-${Date.now()}`,
          target: item.title,
          action,
          result: result.fallback ? "fallback" : "success",
          at: new Date().toISOString(),
          note: nextNote,
          reviewer: nextReviewer,
        },
        ...prev,
      ].slice(0, 8));
      if (action === "reject" || reviewNote.trim()) {
        setReviewNote("");
      }
    } catch {
      setFeedback({
        kind: "error",
        text: "请求失败，请检查网络或服务状态。",
      });
      setOperationLogs((prev) => [
        {
          id: `${item.id}-${Date.now()}`,
          target: item.title,
          action,
          result: "error",
          at: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 8));
    } finally {
      setBusyId(null);
    }
  }

  async function runBulkAction(action: AdminReviewAction) {
    const selectedItems = rawItems.filter((item) => selectedIds.includes(item.id));
    if (selectedItems.length === 0) {
      setFeedback({ kind: "error", text: "请先选择至少一条记录。" });
      return;
    }
    if (action === "reject" && !reviewNote.trim()) {
      setFeedback({ kind: "error", text: "批量驳回前请先填写驳回原因。" });
      return;
    }

    setBulkPending(true);
    setFeedback(null);
    let successCount = 0;

    for (const item of selectedItems) {
      const endpoint =
        activeTarget === "submissions"
          ? `/api/admin/submissions/${encodeURIComponent(item.id)}/review`
          : `/api/admin/requests/${encodeURIComponent(item.id)}/review`;
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, note: reviewNote.trim() || `admin-ui:${action}` }),
        });
        const result = (await response.json()) as ReviewApiResult;
        if (!response.ok || !result.success) continue;

        const now = result.reviewedAt || new Date().toISOString();
        const nextStatus = result.status || item.status;
        const nextReviewer = result.reviewedBy || item.reviewedBy || "system-review";
        const nextNote = result.note || reviewNote.trim() || item.reviewNote;
        const updater = (list: ReviewItem[]) =>
          list.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: nextStatus,
                  reviewNote: nextNote,
                  reviewedAt: now,
                  reviewedBy: nextReviewer,
                }
              : entry,
          );

        if (activeTarget === "submissions") {
          setSubmissions((prev) => updater(prev));
        } else {
          setRequests((prev) => updater(prev));
        }

        setOperationLogs((prev) => [
          {
            id: `${item.id}-${Date.now()}-${action}`,
            target: item.title,
            action: `bulk:${action}`,
            result: result.fallback ? "fallback" : "success",
            at: new Date().toISOString(),
            note: nextNote,
            reviewer: nextReviewer,
          },
          ...prev,
        ].slice(0, 8));
        successCount += 1;
      } catch {
        continue;
      }
    }

    setBulkPending(false);
    setSelectedIds([]);
    if (successCount > 0) {
      setFeedback({
        kind: "success",
        text: `已批量处理 ${successCount} 条${activeTarget === "submissions" ? "投稿" : "合作需求"}。`,
      });
      setReviewNote("");
      return;
    }

    setFeedback({ kind: "error", text: "批量操作未成功，请稍后重试。" });
  }

  return (
    <article className="rounded-[30px] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(18,36,96,0.10),0_8px_24px_rgba(18,36,96,0.07)] sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">审核队列</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-strong">
            当前重点处理队列
          </h2>
        </div>
        <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-xs font-medium text-navy-strong">
          最小审核台
        </span>
      </div>

      <div className="mt-5 flex gap-2">
        {(["submissions", "requests"] as ReviewTarget[]).map((target) => (
          <button
            key={target}
            type="button"
            onClick={() => {
              setActiveTarget(target);
              setCurrentPage(1);
              setSelectedIds([]);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              activeTarget === target
                ? "bg-navy-strong text-white"
                : "border border-border bg-[#fbfcff] text-copy-soft"
            }`}
          >
            {TARGET_LABEL[target]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(["all", "draft", "pending_review", "approved", "rejected", "published"] as const).map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
                setSelectedIds([]);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusFilter === status
                  ? "bg-[#1d7f67] text-white"
                  : "border border-border bg-[#fbfcff] text-copy-soft"
              }`}
            >
              {status === "all" ? "全部状态" : STATUS_LABEL[status]}
            </button>
          ),
        )}
      </div>

      {feedback ? (
        <div
          className={`mt-4 rounded-xl px-3 py-2 text-sm ${
            feedback.kind === "success"
              ? "bg-[#f4fbf8] text-[#1b7f5f]"
              : "bg-[#fff4f4] text-[#a13a3a]"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <div className="mt-4 rounded-[22px] border border-border bg-[#fbfcff] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-navy-strong">审核说明 / 驳回原因</p>
            <p className="mt-1 text-xs leading-6 text-copy-soft">
              单条操作和批量操作都会优先使用这里的说明；驳回时必须填写原因。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleSelectPage}
              disabled={items.length === 0}
              className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-navy-strong disabled:opacity-60"
            >
              {items.length > 0 && items.every((item) => selectedIds.includes(item.id)) ? "取消本页全选" : "全选本页"}
            </button>
            <button
              type="button"
              onClick={() => void runBulkAction("approve")}
              disabled={bulkPending || selectedIds.length === 0}
              className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-navy-strong disabled:opacity-60"
            >
              批量通过
            </button>
            <button
              type="button"
              onClick={() => void runBulkAction("reject")}
              disabled={bulkPending || selectedIds.length === 0}
              className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-navy-strong disabled:opacity-60"
            >
              批量拒绝
            </button>
          </div>
        </div>
        <textarea
          value={reviewNote}
          onChange={(event) => setReviewNote(event.target.value)}
          rows={3}
          placeholder="填写审核说明或驳回原因，例如：缺少来源说明、联系方式策略不完整、标签结构待补齐。"
          className="mt-3 w-full rounded-[18px] border border-border bg-white px-4 py-3 text-sm text-copy outline-none placeholder:text-copy-soft"
        />
        <p className="mt-2 text-xs text-copy-soft">
          当前已选择 {selectedIds.length} 条。批量驳回会将这里的原因写入所有选中项。
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <article className="rounded-[24px] border border-border bg-[#fbfcff] px-4 py-6 text-sm text-copy-soft">
            审核队列加载中...
          </article>
        ) : null}

        {!loading && filteredItems.length === 0 ? (
          <article className="rounded-[24px] border border-border bg-[#fbfcff] px-4 py-6 text-sm text-copy-soft">
            当前没有待处理数据。
          </article>
        ) : null}

        {items.map((item) => (
          <article key={item.id} className="rounded-[24px] border border-border bg-[#fbfcff] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelected(item.id)}
                  className="mt-1 h-4 w-4 rounded border-border"
                />
                <div>
                  <p className="text-sm font-semibold text-navy-strong">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-copy-soft">{item.summary}</p>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-copy-soft">
                {STATUS_LABEL[item.status]}
              </span>
            </div>
            <p className="mt-2 text-xs text-copy-soft">
              操作者：{item.reviewedBy || "未记录"} · 更新时间：{formatTime(item.reviewedAt)}
            </p>
            {item.reviewNote ? (
              <p className="mt-2 text-xs leading-6 text-copy-soft">审核说明：{item.reviewNote}</p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["submit_review", "提交审核"],
                  ["approve", "通过"],
                  ["reject", "拒绝"],
                  ["publish", "发布"],
                ] as Array<[AdminReviewAction, string]>
              ).map(([action, label]) => {
                const enabled = canRunAction(item.status, action);
                return (
                  <button
                    key={`${item.id}-${action}`}
                    type="button"
                    disabled={!enabled || busyId === item.id || bulkPending}
                    onClick={() => runAction(item, action)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      enabled && busyId !== item.id && !bulkPending
                        ? "bg-white text-navy-strong ring-1 ring-border hover:bg-[#f4f8ff]"
                        : "bg-[#f1f3f8] text-copy-soft"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-copy-soft">
          共 {filteredItems.length} 条，当前第 {safeCurrentPage}/{pageCount} 页
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safeCurrentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
              setSelectedIds([]);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              safeCurrentPage <= 1
                ? "bg-[#f1f3f8] text-copy-soft"
                : "bg-white text-navy-strong ring-1 ring-border"
            }`}
          >
            上一页
          </button>
          <button
            type="button"
            disabled={safeCurrentPage >= pageCount}
            onClick={() => {
              setCurrentPage((prev) => Math.min(pageCount, prev + 1));
              setSelectedIds([]);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              safeCurrentPage >= pageCount
                ? "bg-[#f1f3f8] text-copy-soft"
                : "bg-white text-navy-strong ring-1 ring-border"
            }`}
          >
            下一页
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-border bg-[#fbfcff] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">操作日志</p>
        <div className="mt-3 space-y-2">
          {operationLogs.length === 0 ? (
            <p className="text-sm text-copy-soft">暂无操作日志。</p>
          ) : (
            operationLogs.map((log) => (
              <div key={log.id} className="rounded-xl bg-white px-3 py-2 text-xs text-copy-soft">
                [{formatTime(log.at)}] {log.target} · {log.action} · {log.result}
                {log.reviewer ? ` · ${log.reviewer}` : ""}
                {log.note ? ` · ${log.note}` : ""}
              </div>
            ))
          )}
        </div>
      </div>
    </article>
  );
}
