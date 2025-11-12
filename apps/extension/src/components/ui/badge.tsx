import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const badgeStyles = {
  neutral: "bg-ink-100 text-ink-700",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  info: "bg-primary-100 text-primary-700",
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
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
      badgeStyles[variant],
      className
    )}
    {...props}
  />
);
