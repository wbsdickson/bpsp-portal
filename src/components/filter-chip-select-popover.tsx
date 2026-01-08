"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string;
  label: React.ReactNode;
};

type FilterChipSelectPopoverProps = {
  label: React.ReactNode;
  value: string;
  options: SelectOption[];
  onChange: (nextValue: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  resetLabel?: React.ReactNode;
  disabled?: boolean;
};

export function FilterChipSelectPopover({
  label,
  value,
  options,
  onChange,
  placeholder,
  searchPlaceholder = "Search...",
  resetLabel = "Reset filters",
  disabled,
}: FilterChipSelectPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? null;
  const active = Boolean(value);

  const filteredOptions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => String(o.label).toLowerCase().includes(q));
  }, [options, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-8 gap-2 rounded-full px-3"
        >
          <span
            className={active ? "text-foreground" : "text-muted-foreground"}
          >
            {label}
          </span>
          {active ? (
            <span className="text-foreground max-w-[140px] truncate">
              {selected?.label ?? placeholder ?? value}
            </span>
          ) : null}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[260px] p-2">
        <div className="space-y-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9"
            placeholder={searchPlaceholder}
          />

          <ScrollArea className="h-[220px]">
            <div className="space-y-1 p-1">
              {filteredOptions.map((o) => {
                const isSelected = o.value === value;
                return (
                  <button
                    key={o.value}
                    
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                      isSelected && "bg-accent",
                    )}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full border",
                        isSelected && "border-foreground",
                      )}
                      aria-hidden
                    >
                      {isSelected ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className="flex-1">{o.label}</span>
                  </button>
                );
              })}

              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground px-2 py-3 text-sm">
                  No results.
                </div>
              ) : null}
            </div>
          </ScrollArea>

          <button
            
            className="text-muted-foreground hover:text-foreground w-full rounded-md py-2 text-center text-sm"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            {resetLabel}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
