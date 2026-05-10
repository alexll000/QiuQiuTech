import * as React from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  required = false,
  className,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs uppercase tracking-[0.16em] text-copy-soft">
          {label}
          {required ? " · 必填" : ""}
        </p>
        {hint ? <span className="text-xs text-copy-soft">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}
