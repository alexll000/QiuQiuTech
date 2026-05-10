"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormPanel } from "@/components/ui/form-shell";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  CmsFieldBlueprint,
  CmsSubmissionCenterData,
  SubmissionType,
} from "@/lib/cms-types";

function splitTags(input: string): string[] {
  return input
    .split(/[，,]/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

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

function findField(formFields: CmsFieldBlueprint[], labelContains: string) {
  return formFields.find((f) => f.label.includes(labelContains));
}

export function SubmissionDraftForm({
  submissionCenter,
  hideHeader = false,
}: {
  submissionCenter: CmsSubmissionCenterData;
  hideHeader?: boolean;
}) {
  const titlePlaceholder = useMemo(() => {
    return findField(submissionCenter.formFields, "标题")?.value || "标题";
  }, [submissionCenter.formFields]);

  const summaryPlaceholder = useMemo(() => {
    return (
      findField(submissionCenter.formFields, "一句话摘要")?.value ||
      findField(submissionCenter.formFields, "摘要")?.value ||
      "一句话摘要"
    );
  }, [submissionCenter.formFields]);

  const tagsPlaceholder = useMemo(() => {
    return findField(submissionCenter.formFields, "标签")?.value || "标签";
  }, [submissionCenter.formFields]);

  const sourcePlaceholder = useMemo(() => {
    return findField(submissionCenter.formFields, "来源链接")?.value || "来源链接";
  }, [submissionCenter.formFields]);

  const [submissionType, setSubmissionType] = useState<SubmissionType>("case");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const typeOptions: Array<{ value: SubmissionType; label: string }> = [
    { value: "case", label: "案例投稿" },
    { value: "event", label: "营销事件投稿" },
    { value: "playbook", label: "玩法拆解投稿" },
  ];

  async function handleSubmit() {
    setPending(true);
    setMessage(null);
    try {
      const result = await postJson<{
        ok: boolean;
        message: string;
        draftId?: string;
      }>("/api/submissions/drafts", {
        submissionType,
        title,
        summary,
        tags: splitTags(tagsText),
        sourceUrl: sourceUrl ? sourceUrl : undefined,
      });
      setMessage(result?.message || "已保存草稿");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "保存失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <section>
      {!hideHeader ? (
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
            Structured Form
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy-strong">
            结构化投稿草稿
          </h2>
          <p className="mt-2 text-sm leading-7 text-copy-soft">
            填完后先保存为草稿；审核通过后将进入对应内容系统并获得联动曝光位。
          </p>
        </div>
      ) : null}

      <div className={`${hideHeader ? "" : "mt-7"} grid gap-4 md:grid-cols-2`}>
        <FormPanel>
          <Field label="投稿类型" required>
            <Select
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value as SubmissionType)}
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </Field>
        </FormPanel>

        <FormPanel>
          <Field label="标签（逗号分隔）">
            <Input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder={tagsPlaceholder}
            />
          </Field>
        </FormPanel>

        <FormPanel className="md:col-span-2">
          <Field label="标题" required>
            <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
            />
          </Field>
        </FormPanel>

        <FormPanel className="md:col-span-2">
          <Field label="一句话摘要" required>
            <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={summaryPlaceholder}
            className="resize-y"
            />
          </Field>
        </FormPanel>

        <FormPanel className="md:col-span-2">
          <Field label="来源链接">
            <Input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder={sourcePlaceholder}
            />
          </Field>
        </FormPanel>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={pending || !title.trim() || !summary.trim()}
        >
          {pending ? "保存中..." : "保存草稿"}
        </Button>
        {message ? (
          <span className="text-sm font-medium text-teal">{message}</span>
        ) : (
          <span className="text-sm text-copy-soft">
            提交后可在「用户中心」查看草稿与审核状态（接入真实登录后生效）。
          </span>
        )}
      </div>
    </section>
  );
}
