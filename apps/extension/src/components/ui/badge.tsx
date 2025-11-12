import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const badgeStyles = {
  neutral:
    "bg-brutal-blue text-brutal-navy border-2 border-brutal-navy shadow-brutal-sm",
  success:
    "bg-brutal-green text-brutal-navy border-2 border-brutal-navy shadow-brutal-sm",
  warning:
    "bg-brutal-orange text-brutal-navy border-2 border-brutal-navy shadow-brutal-sm",
  info: "bg-brutal-pink text-brutal-navy border-2 border-brutal-navy shadow-brutal-sm",
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
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
      badgeStyles[variant],
      className
    )}
    {...props}
  />
);
