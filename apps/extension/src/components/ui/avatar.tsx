import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "pending";
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
} satisfies Record<string, string>;

const statusColors: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "bg-[#60a5fa]",
  offline: "bg-white/40",
  pending: "bg-[#f472b6]",
};

export const Avatar = ({
  className,
  name,
  src,
  size = "md",
  status,
  ...props
}: AvatarProps) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={cn(
        "relative inline-flex rounded-full border border-white/35 bg-white/25 p-[3px] shadow-glass-soft backdrop-blur-glass",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "inline-flex rounded-full object-cover",
            sizes[size],
            "border border-white/40"
          )}
        />
      ) : (
        <div
          aria-hidden
          className={cn(
            "inline-flex select-none items-center justify-center rounded-full bg-white/50 font-semibold text-glass-slate900",
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      {status ? (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full border border-white/60",
            statusColors[status]
          )}
          aria-hidden
        />
      ) : null}
    </div>
  );
};
