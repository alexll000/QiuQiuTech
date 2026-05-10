"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LATEST_CONVERSATION_BRIEF } from "@/lib/latest-conversation-brief";

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers / restricted environments
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function LatestConversationBriefDialog() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function handleCopy() {
    await copyToClipboard(LATEST_CONVERSATION_BRIEF);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-navy-strong hover:bg-surface-muted"
      >
        打开对接 Brief
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0b132b]/50 backdrop-blur-sm p-4"
          role="presentation"
          onMouseDown={(e) => {
            // Close only when clicking the overlay itself (not the dialog content)
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-[980px] max-h-[86vh] overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_8px_32px_rgba(18,36,96,0.20),0_24px_72px_rgba(18,36,96,0.14)]"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
                  AI 交接
                </p>
                <h2 id={titleId} className="mt-2 text-xl font-semibold tracking-tight text-navy-strong">
                  最新对接 Brief
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-2xl font-medium text-copy-soft hover:bg-surface-muted"
                aria-label="关闭"
              >
                ×
              </button>
            </div>

            <div className="max-h-[calc(86vh-70px)] overflow-auto px-6 py-5">
              <div className="rounded-[18px] border border-border bg-[#fbfcff] p-4">
                <p className="text-sm leading-7 text-copy-soft">
                  点击下方「复制」按钮，将下面内容原样给下一个 AI 对话框直接复刻执行。
                </p>

                <pre className="mt-4 max-h-[58vh] overflow-auto whitespace-pre-wrap break-words rounded-[16px] border border-border bg-white px-4 py-4 font-mono text-[12px] leading-6 text-copy">
                  {LATEST_CONVERSATION_BRIEF}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full bg-navy-strong px-5 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-70"
              >
                {copied ? "已复制" : "复制到剪贴板"}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border bg-white px-5 py-2 text-sm font-medium text-navy-strong hover:bg-surface-muted"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
