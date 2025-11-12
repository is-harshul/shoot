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
  online: "bg-brutal-green",
  offline: "bg-brutal-navy/40",
  pending: "bg-brutal-orange",
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
        "relative inline-flex rounded-full border-2 border-brutal-navy bg-white shadow-brutal-sm",
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
            "border-2 border-brutal-navy"
          )}
        />
      ) : (
        <div
          aria-hidden
          className={cn(
            "inline-flex select-none items-center justify-center rounded-full bg-brutal-yellow font-semibold text-brutal-navy",
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      {status ? (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full border-2 border-white",
            statusColors[status]
          )}
          aria-hidden
        />
      ) : null}
    </div>
  );
};
