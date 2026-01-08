"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

export type FilterOperator = "eq";

type FilterChipPopoverProps = {
  label: React.ReactNode;
  value: string;
  onChange: (nextValue: string) => void;
  operator?: FilterOperator;
  onOperatorChange?: (op: FilterOperator) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function FilterChipPopover({
  label,
  value,
  onChange,
  operator = "eq",
  onOperatorChange,
  placeholder,
  disabled,
}: FilterChipPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value);

  React.useEffect(() => {
    if (!open) return;
    setDraft(value);
  }, [open, value]);

  const active = value.trim().length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            <span className="text-foreground max-w-[140px] truncate">
              {value}
            </span>
          ) : null}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[300px] p-3">
        <div className="space-y-3">
          <div className="grid grid-cols-2 items-center gap-2">
            <Select
              value={operator}
              onValueChange={(v) => onOperatorChange?.(v as FilterOperator)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eq">is equal to</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-9"
              placeholder={placeholder}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                setDraft("");
                onChange("");
                setOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              
              size="sm"
              className="h-8"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
