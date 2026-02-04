import * as React from "react";
import { cn } from "@/shared/lib/cn";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectSearchableProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export function SelectSearchable({
  label,
  placeholder,
  options,
  value,
  required,
  error,
  onChange,
}: SelectSearchableProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const current = options.find((option) => option.value === value);
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full text-sm">
      {label ? (
        <label className="mb-2 block font-semibold text-ink">{label}</label>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-2xl border border-dune bg-white px-4 text-left text-base text-ink shadow-sm",
          error ? "border-rose border-dashed" : ""
        )}
      >
        <span>{current?.label ?? placeholder ?? "Select"}</span>
        <span className="text-clay">▾</span>
      </button>
      {open ? (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-dune bg-white shadow-xl">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type to search..."
            className="h-10 w-full rounded-t-2xl border-b border-dune px-3 text-sm focus:outline-none"
          />
          <div className="max-h-56 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-clay">No results</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm hover:bg-mist"
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
      {error ? <p className="mt-1 text-xs text-rose">{error}</p> : null}
    </div>
  );
}
