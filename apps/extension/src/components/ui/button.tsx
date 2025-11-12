import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brutal-navy bg-white px-4 font-semibold text-brutal-navy shadow-brutal transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brutal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brutal-cream disabled:pointer-events-none disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0";

const variantStyles = {
  primary: "bg-brutal-yellow text-brutal-navy hover:bg-[#fbd94f]",
  secondary: "bg-white text-brutal-navy hover:bg-brutal-blue/30",
  ghost:
    "bg-transparent text-brutal-navy border-dashed hover:bg-brutal-blue/20",
  subtle: "bg-brutal-pink text-brutal-navy hover:bg-brutal-pink/90",
} satisfies Record<string, string>;

const sizeStyles = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
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
