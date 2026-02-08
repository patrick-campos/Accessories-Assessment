import * as React from "react";
import { cn } from "@/shared/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm">
      {label ? <span className="mb-[0.4rem] block text-normal text-secondaryTitle">{label}</span> : null}
      <input
        className={cn(
          "h-[4.4rem] rounded-sm border border-dune bg-white px-4 text-base text-ink shadow-sm focus:border-ink focus:outline-none",
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
