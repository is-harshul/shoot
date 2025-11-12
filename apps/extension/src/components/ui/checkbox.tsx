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
        "inline-flex h-5 w-5 items-center justify-center rounded-md border border-white/40 bg-white/25 text-glass-slate900 shadow-glass-soft backdrop-blur-glass transition focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-glass-accent accent-[#60a5fa]",
        variant === "subtle" && "border-white/25",
        className
      )}
      {...props}
    />
  )
);

Checkbox.displayName = "Checkbox";
