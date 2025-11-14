import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-full border border-white/25 bg-white/15 px-4 text-sm text-white shadow-glass-soft backdrop-blur-glass outline-none transition focus:border-white focus:ring-2 focus:ring-glass-accent/40 focus:ring-offset-1 focus:ring-offset-white/10 placeholder:text-white/55 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
