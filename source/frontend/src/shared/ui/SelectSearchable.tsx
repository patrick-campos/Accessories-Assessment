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

type SelectSearchableState = {
  open: boolean;
  query: string;
};

function useOutsideClick(ref: React.RefObject<HTMLElement>, onOutside: () => void) {
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onOutside]);
}

function filterOptions(options: SelectOption[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return options;
  return options.filter((option) => option.label.toLowerCase().includes(normalized));
}

function SelectLabel({ label }: { label?: string }) {
  if (!label) return null;
  return <label className="mb-[0.4rem] block text-normal text-secondaryTitle">{label}</label>;
}

function SelectTrigger({
  label,
  placeholder,
  currentLabel,
  error,
  onToggle,
}: {
  label?: string;
  placeholder?: string;
  currentLabel?: string;
  error?: string;
  onToggle: () => void;
}) {
  return (
    <>
      <SelectLabel label={label} />
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex h-[4.4rem] w-full items-center justify-between rounded-[0.8rem] border border-dune bg-white pl-[1.4rem] pr-[1.2rem] text-left text-base text-ink shadow-sm",
          error ? "border-rose border-dashed" : ""
        )}
      >
        <span>{currentLabel ?? placeholder ?? "Select"}</span>
        <span className="text-clay">v</span>
      </button>
    </>
  );
}

function SelectMenu({
  query,
  options,
  onSearch,
  onSelect,
}: {
  query: string;
  options: SelectOption[];
  onSearch: (value: string) => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="absolute z-20 mt-2 w-full rounded-2xl border border-dune bg-white shadow-xl">
      <input
        type="text"
        value={query}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Type to search..."
        className="h-10 w-full rounded-t-2xl border-b border-dune px-3 text-sm focus:outline-none"
      />
      <div className="max-h-56 overflow-y-auto p-2">
        {options.length === 0 ? (
          <div className="px-3 py-2 text-xs text-clay">No results</div>
        ) : (
          options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm hover:bg-mist"
            >
              {option.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export function SelectSearchable({
  label,
  placeholder,
  options,
  value,
  required,
  error,
  onChange,
}: SelectSearchableProps) {
  const [{ open, query }, setState] = React.useState<SelectSearchableState>({
    open: false,
    query: "",
  });
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const current = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );
  const filteredOptions = React.useMemo(
    () => filterOptions(options, query),
    [options, query]
  );

  const closeMenu = React.useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const toggleMenu = React.useCallback(() => {
    setState((prev) => ({ ...prev, open: !prev.open }));
  }, []);

  const handleSearch = React.useCallback((nextQuery: string) => {
    setState((prev) => ({ ...prev, query: nextQuery }));
  }, []);

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      onChange(selectedValue);
      setState({ open: false, query: "" });
    },
    [onChange]
  );

  useOutsideClick(containerRef, closeMenu);

  return (
    <div ref={containerRef} className="relative w-full text-sm">
      <SelectTrigger
        label={label}
        placeholder={placeholder}
        currentLabel={current?.label}
        error={error}
        onToggle={toggleMenu}
      />
      {open ? (
        <SelectMenu
          query={query}
          options={filteredOptions}
          onSearch={handleSearch}
          onSelect={handleSelect}
        />
      ) : null}
      {required ? null : null}
      {error ? <p className="mt-1 text-xs text-rose">{error}</p> : null}
    </div>
  );
}
