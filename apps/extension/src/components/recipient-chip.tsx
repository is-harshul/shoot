import type { ButtonHTMLAttributes } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/cn";

export interface RecipientChipProps {
  label: string;
  onRemove?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

export const RecipientChip = ({ label, onRemove }: RecipientChipProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-glass-sm rounded-pill border border-white/35 bg-white/25 px-glass-sm py-[6px] text-xs font-semibold uppercase tracking-wide text-white shadow-glass-soft backdrop-blur-glass"
    )}
  >
    {label}
    {onRemove ? (
      <button
        aria-label={`Remove ${label}`}
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/40 text-white transition hover:-translate-y-0.5 hover:bg-white/60"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </button>
    ) : null}
  </span>
);
