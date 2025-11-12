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
        "inline-flex h-5 w-5 items-center justify-center rounded-md border-2 border-brutal-navy bg-white text-brutal-navy shadow-brutal-sm transition focus-visible:outline-offset-2 focus-visible:outline-4 focus-visible:outline-brutal-blue accent-brutal-yellow",
        variant === "subtle" && "border-brutal-navy/70",
        className
      )}
      {...props}
    />
  )
);

Checkbox.displayName = "Checkbox";
