import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const badgeStyles = {
  neutral:
    "bg-white/20 text-white border border-white/30 shadow-glass-soft backdrop-blur-glass",
  success:
    "bg-[rgba(34,197,94,0.25)] text-white border border-white/25 shadow-glass-soft backdrop-blur-glass",
  warning:
    "bg-[rgba(250,204,21,0.25)] text-white border border-white/25 shadow-glass-soft backdrop-blur-glass",
  info: "bg-[rgba(96,165,250,0.3)] text-white border border-white/30 shadow-glass-soft backdrop-blur-glass",
};

export type BadgeVariant = keyof typeof badgeStyles;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = ({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-pill px-glass-sm py-[6px] text-xs font-semibold uppercase tracking-wide",
      badgeStyles[variant],
      className
    )}
    {...props}
  />
);
