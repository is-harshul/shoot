import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-pill border border-white/40 bg-white/30 px-glass-sm py-2 font-semibold text-glass-slate900 shadow-glass backdrop-blur-glass transition-all duration-200 hover:bg-white/45 hover:shadow-glass-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glass-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white/10 disabled:pointer-events-none disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0";

const variantStyles = {
  primary:
    "border-transparent bg-[linear-gradient(135deg,rgba(96,165,250,0.95),rgba(165,180,252,0.9))] text-white shadow-glass hover:shadow-glass-soft",
  secondary:
    "bg-white/40 text-glass-slate900 border-white/50 hover:bg-white/55",
  ghost:
    "border border-transparent bg-transparent text-white hover:bg-white/15",
  subtle:
    "border border-white/30 bg-white/25 text-glass-slate900 hover:bg-white/35",
} satisfies Record<string, string>;

const sizeStyles = {
  sm: "min-h-[36px] px-glass-sm text-xs",
  md: "min-h-[40px] px-glass text-sm",
  lg: "min-h-[48px] px-glass-lg text-base",
} satisfies Record<string, string>;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        buttonBase,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
