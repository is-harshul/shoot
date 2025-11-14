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
      "inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-glass-soft backdrop-blur-glass"
    )}
  >
    {label}
    {onRemove ? (
      <button
        aria-label={`Remove ${label}`}
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/35 text-white transition hover:-translate-y-0.5 hover:bg-white/55"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </button>
    ) : null}
  </span>
);
