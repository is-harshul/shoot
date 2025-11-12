import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

export type CheckboxProps = ComponentPropsWithoutRef<"input"> & {
  variant?: "default" | "subtle";
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded border border-ink-300 text-primary-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2",
        variant === "subtle" && "border-ink-200",
        className
      )}
      {...props}
    />
  )
);

Checkbox.displayName = "Checkbox";
