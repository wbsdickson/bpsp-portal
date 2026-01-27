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

export type MultiSelectOption = {
  value: string;
  label: React.ReactNode;
};

type FilterChipMultiSelectPopoverProps = {
  label: React.ReactNode;
  values: string[];
  options: MultiSelectOption[];
  onChange: (nextValues: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  resetLabel?: React.ReactNode;
  doneLabel?: React.ReactNode;
  disabled?: boolean;
};

export function FilterChipMultiSelectPopover({
  label,
  values,
  options,
  onChange,
  placeholder,
  searchPlaceholder = "Search...",
  resetLabel = "Reset",
  doneLabel = "Done",
  disabled,
}: FilterChipMultiSelectPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [draft, setDraft] = React.useState<string[]>(values);

  React.useEffect(() => {
    if (!open) return;
    setDraft(values);
    setQuery("");
  }, [open, values]);

  const active = draft.length > 0;

  const q = query.trim().toLowerCase();
  const filteredOptions = !q
    ? options
    : options.filter((o) => String(o.label).toLowerCase().includes(q));

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setDraft(values);
          setQuery("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-8 gap-2 rounded-md px-3"
        >
          <span
            className={active ? "text-foreground" : "text-muted-foreground"}
          >
            {label}
          </span>
          {active ? (
            <span className="text-foreground">{draft.length}</span>
          ) : placeholder ? (
            <span className="text-muted-foreground">{placeholder}</span>
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
                const isSelected = draft.includes(o.value);
                return (
                  <button
                    key={o.value}
                    
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                      isSelected && "bg-accent",
                    )}
                    onClick={() => {
                      setDraft((prev) =>
                        prev.includes(o.value)
                          ? prev.filter((v) => v !== o.value)
                          : [...prev, o.value],
                      );
                    }}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border",
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

          <div className="flex items-center justify-between gap-2">
            <Button
              
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                setDraft([]);
                onChange([]);
                setOpen(false);
              }}
            >
              {resetLabel}
            </Button>
            <Button
              
              size="sm"
              className="h-8"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              {doneLabel}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
