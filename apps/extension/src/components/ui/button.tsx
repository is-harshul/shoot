import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glass-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white/10 disabled:pointer-events-none disabled:opacity-60 active:translate-y-0";

const variantStyles = {
  primary:
    "border border-transparent bg-[linear-gradient(135deg,rgba(96,165,250,0.95),rgba(165,180,252,0.85))] shadow-glass hover:shadow-glass-soft",
  secondary:
    "border border-white/35 bg-white/25 text-white hover:bg-white/35 hover:text-white",
  ghost:
    "border border-transparent bg-transparent text-white/80 hover:bg-white/10 hover:text-white",
  subtle: "border border-white/30 bg-white/15 text-white/90 hover:bg-white/25",
} satisfies Record<string, string>;

const sizeStyles = {
  sm: "min-h-[36px] px-3 text-xs",
  md: "min-h-[40px] px-4 text-sm",
  lg: "min-h-[48px] px-6 text-base",
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
