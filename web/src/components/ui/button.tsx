import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-navy text-white shadow-[0_2px_8px_rgba(18,36,96,0.12),0_8px_24px_rgba(18,36,96,0.08)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(18,36,96,0.14),0_16px_48px_rgba(18,36,96,0.10)]",
        secondary:
          "border border-border bg-white text-navy hover:bg-surface-muted hover:border-border-strong",
        soft: "bg-surface-deep text-navy hover:bg-[#e3ebfa]",
        ghost: "text-copy-soft hover:text-copy hover:bg-surface-muted",
        destructive:
          "bg-[#d43f5e] text-white shadow-[0_2px_8px_rgba(212,63,94,0.15),0_8px_24px_rgba(212,63,94,0.10)] hover:-translate-y-0.5",
        teal:
          "bg-teal text-white shadow-[0_2px_8px_rgba(38,167,163,0.18),0_8px_24px_rgba(38,167,163,0.12)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(38,167,163,0.22),0_16px_48px_rgba(38,167,163,0.16)]",
      },
      size: {
        xs:   "h-8 px-4 text-xs rounded-[var(--radius-sm)]",
        sm:   "h-9 px-5 text-sm rounded-[var(--radius-md)]",
        md:   "h-11 px-6 text-sm rounded-[var(--radius-lg)]",
        lg:   "h-13 px-8 text-base rounded-[var(--radius-xl)]",
        xl:   "h-14 px-10 text-base rounded-[var(--radius-xl)]",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
