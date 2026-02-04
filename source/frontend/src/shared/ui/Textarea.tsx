import * as React from "react";
import { cn } from "@/shared/lib/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Textarea({ label, hint, error, className, ...props }: TextareaProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm">
      {label ? <span className="font-semibold text-ink">{label}</span> : null}
      <textarea
        className={cn(
          "min-h-[120px] rounded-2xl border border-dune bg-white px-4 py-3 text-base text-ink shadow-sm focus:border-ink focus:outline-none",
          error ? "border-rose border-dashed" : "",
          className
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-clay">{hint}</span> : null}
      {error ? <span className="text-xs text-rose">{error}</span> : null}
    </label>
  );
}
