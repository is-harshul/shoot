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
        "h-11 w-full rounded-2xl border-2 border-brutal-navy bg-white px-4 text-sm text-brutal-navy shadow-brutal-sm outline-none transition focus:border-brutal-navy focus:ring-4 focus:ring-brutal-blue/40 focus:ring-offset-2 focus:ring-offset-brutal-cream placeholder:text-brutal-navy/60 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
