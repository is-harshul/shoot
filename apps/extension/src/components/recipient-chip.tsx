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
      "inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
    )}
  >
    {label}
    {onRemove ? (
      <button
        aria-label={`Remove ${label}`}
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-primary-600 transition hover:bg-primary-200/70"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </button>
    ) : null}
  </span>
);
