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
      "inline-flex items-center gap-2 rounded-full border-2 border-brutal-navy bg-brutal-pink px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brutal-navy shadow-brutal-sm"
    )}
  >
    {label}
    {onRemove ? (
      <button
        aria-label={`Remove ${label}`}
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-brutal-navy bg-white text-brutal-navy transition hover:-translate-y-0.5 hover:bg-brutal-yellow"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </button>
    ) : null}
  </span>
);
