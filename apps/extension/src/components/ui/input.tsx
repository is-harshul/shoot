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
        "h-11 w-full rounded-glass border border-white/35 bg-white/25 px-glass-sm text-sm text-glass-slate900 shadow-glass-soft backdrop-blur-glass outline-none transition focus:border-white focus:ring-2 focus:ring-glass-accent/40 focus:ring-offset-2 focus:ring-offset-white/10 placeholder:text-white/60 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
