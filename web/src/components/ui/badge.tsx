import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        neutral: "border-border bg-white text-copy-soft",
        strong: "border-transparent bg-navy-strong text-white",
        soft: "border-[#d8efe9] bg-[#f4fbf8] text-[#1d7f67]",
        info: "border-[#d6e4ff] bg-[#f4f8ff] text-[#256fe6]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
