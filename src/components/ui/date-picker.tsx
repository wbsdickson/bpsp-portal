"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type DatePickerProps = {
  id?: string;
  label?: React.ReactNode;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
};

export function DatePicker({
  id = "date",
  label,
  value: selectedDate,
  onChange,
  placeholder,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(selectedDate);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [inputValue, setInputValue] = React.useState(formatDate(date));

  React.useEffect(() => {
    setDate(selectedDate);
    setMonth(selectedDate);
    setInputValue(formatDate(selectedDate));
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-3">
      {label != null ? (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      ) : null}
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={(e) => {
            const next = new Date(e.target.value);
            setInputValue(e.target.value);
            if (isValidDate(next)) {
              setDate(next);
              setMonth(next);
              onChange?.(next);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={`${id}-picker`}
              variant="ghost"
              className="absolute right-2 top-1/2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                setInputValue(formatDate(date));
                onChange?.(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
