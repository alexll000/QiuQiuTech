import * as React from "react";
import { cn } from "@/lib/utils";

export function FormPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[24px] border border-border bg-white p-4 shadow-sm", className)}>
      {children}
    </div>
  );
}
