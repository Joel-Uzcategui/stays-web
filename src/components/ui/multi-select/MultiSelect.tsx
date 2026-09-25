"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

const DEBOUNCE_MS = 200;
const LIST_MAX_HEIGHT = 240;

export interface MultiSelectOption {
  id: string;
  label: string;
}

interface Props {
  label: string;
  selected: MultiSelectOption[];
  onChange: (options: MultiSelectOption[]) => void;
  search: (term: string) => Promise<MultiSelectOption[]>;
  placeholder?: string;
}

export const MultiSelect = ({
  label,
  selected,
  onChange,
  search,
  placeholder = "Search and select…",
}: Props) => {
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const listId = useId();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MultiSelectOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [dropUp, setDropUp] = useState(false);

  const openList = () => {
    const rect = box.current?.getBoundingClientRect();

    if (rect) {
      const below = window.innerHeight - rect.bottom;

      setDropUp(below < LIST_MAX_HEIGHT && rect.top > below);
    }

    setOpen(true);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handle = setTimeout(async () => {
      setLoading(true);

      try {
        setResults(await search(query.trim()));
        setFailed(false);
      } catch {
        setResults([]);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [query, open, search]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const has = (id: string) => selected.some((option) => option.id === id);

  const toggle = (option: MultiSelectOption) =>
    onChange(
      has(option.id)
        ? selected.filter((current) => current.id !== option.id)
        : [...selected, option],
    );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "Backspace" && query === "" && selected.length > 0) {
      onChange(selected.slice(0, -1));
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openList();

      if (results.length > 0) {
        const step = event.key === "ArrowDown" ? 1 : results.length - 1;
        setHighlight((current) => (current + step) % results.length);
      }

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (open && results[highlight]) {
        toggle(results[highlight]);
      } else {
        openList();
      }
    }
  };

  return (
    <div className="relative flex flex-col gap-1" ref={box}>
      <span className="kicker text-muted">{label}</span>

      <div
        onClick={() => {
          openList();
          field.current?.focus();
        }}
        className="flex min-h-10 cursor-text flex-wrap items-center gap-1.5 rounded border border-line bg-white/50 px-2 py-1.5"
      >
        {selected.map((option) => (
          <span
            key={option.id}
            className="flex items-center gap-1 rounded-full border border-accent bg-accent-tint py-0.5 pr-1 pl-2.5 text-xs text-accent-ink"
          >
            {option.label}
            <button
              type="button"
              aria-label={`Remove ${option.label}`}
              onClick={(event) => {
                event.stopPropagation();
                toggle(option);
              }}
              className="grid size-4 place-items-center rounded-full transition-colors hover:bg-accent hover:text-white"
            >
              <X size={11} strokeWidth={2} />
            </button>
          </span>
        ))}

        <input
          ref={field}
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={selected.length === 0 ? placeholder : ""}
          onFocus={openList}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            setQuery(event.target.value);
            setHighlight(0);
            openList();
          }}
          className="min-w-24 flex-1 bg-transparent py-0.5 text-sm outline-none placeholder:text-faint"
        />

        <ChevronDown
          size={15}
          strokeWidth={1.5}
          className={`flex-none text-faint transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable
          onMouseDown={(event) => event.preventDefault()}
          className={`absolute right-0 left-0 z-20 max-h-60 overflow-y-auto rounded border border-line bg-white shadow-lg ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-faint">
              {loading
                ? "Searching…"
                : failed
                  ? "Could not load options"
                  : query.trim()
                    ? `Nothing matches "${query.trim()}"`
                    : "Nothing available yet"}
            </p>
          ) : (
            results.map((option, index) => {
              const on = has(option.id);

              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={on}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => toggle(option)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                    highlight === index ? "bg-accent-tint text-accent-ink" : ""
                  }`}
                >
                  <span
                    className={`grid size-4 flex-none place-items-center rounded border ${
                      on ? "border-accent bg-accent text-white" : "border-line"
                    }`}
                  >
                    {on && <Check size={11} strokeWidth={3} />}
                  </span>
                  {option.label}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
