"use client";

import React, { type FC, JSX, useEffect, useRef, useState } from "react";
import { Button, VariantKey } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Calendar } from "./calendar";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "./switch";

import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { enUS } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { DateInput } from "./date-input";
import { Locale } from "react-day-picker";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string;
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string;
  /** Alignment of popover */
  align?: "start" | "center" | "end";
  /** Option for locale */
  locale?: string;
  /** Option for showing compare feature */
  showCompare?: boolean;
  calendarLocale?: Locale;
  className?: string;
  suffixIcon?: React.ReactNode;
  buttonVariant?: VariantKey;
  label?: string;
  labelShown?: boolean;
}

const formatDate = (date: Date, locale: string = "en-us"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface Preset {
  name: string;
  label: string;
}

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = "end",
  locale = "ja-JP",
  showCompare = false,
  calendarLocale = enUS,
  className,
  suffixIcon,
  buttonVariant = "outline",
  label,
  labelShown = false,
}): React.JSX.Element => {
  const t = useTranslations("CommonComponent.Calendar");
  const isMobile = useMediaQuery("(max-width: 767px)");
  // Define presets
  const PRESETS: Preset[] = [
    { name: "today", label: t("today") },
    { name: "yesterday", label: t("yesterday") },
    // { name: "last7", label: t("last7Days") },
    // { name: "last14", label: t("last14Days") },
    // { name: "last30", label: t("last30Days") },
    // { name: "thisWeek", label: "This Week" },
    { name: "thisMonth", label: t("thisMonth") },
    { name: "lastWeek", label: t("lastWeek") },
    { name: "lastMonth", label: t("lastMonth") },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DateRange>({
    from: new Date(new Date(initialDateFrom).setHours(0, 0, 0, 0)),
    to: initialDateTo
      ? new Date(new Date(initialDateTo).setHours(0, 0, 0, 0))
      : new Date(new Date(initialDateFrom).setHours(0, 0, 0, 0)),
  });
  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom
      ? {
          from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
          to: initialCompareTo
            ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
            : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
        }
      : undefined,
  );

  // Refs to store the values of range and rangeCompare when the date picker is opened
  const openedRangeRef = useRef<DateRange | undefined>(undefined);
  const openedRangeCompareRef = useRef<DateRange | undefined>(undefined);

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined,
  );

  const handleUpdate = () => {
    setIsOpen(false);
    if (
      !areRangesEqual(range, openedRangeRef.current) ||
      !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
    ) {
      onUpdate?.({ range, rangeCompare });
    }
  };

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName);
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
    const from = new Date();
    const to = new Date();
    const first = from.getDate() - from.getDay();

    switch (preset.name) {
      case "today":
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "yesterday":
        from.setDate(from.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() - 1);
        to.setHours(23, 59, 59, 999);
        break;
      case "last7":
        from.setDate(from.getDate() - 6);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last14":
        from.setDate(from.getDate() - 13);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last30":
        from.setDate(from.getDate() - 29);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisWeek":
        from.setDate(first);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastWeek":
        from.setDate(from.getDate() - 7 - from.getDay());
        to.setDate(to.getDate() - to.getDay() - 1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisMonth":
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastMonth":
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
    }

    return { from, to };
  };

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    setRange(range);
    if (rangeCompare) {
      const rangeCompare = {
        from: new Date(
          range.from.getFullYear() - 1,
          range.from.getMonth(),
          range.from.getDate(),
        ),
        to: range.to
          ? new Date(
              range.to.getFullYear() - 1,
              range.to.getMonth(),
              range.to.getDate(),
            )
          : undefined,
      };
      setRangeCompare(rangeCompare);
    }
  };

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);
      const normalizedRangeFrom = new Date(range.from);
      normalizedRangeFrom.setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(
        presetRange.from.setHours(0, 0, 0, 0),
      );
      const normalizedRangeTo = new Date(range.to ?? 0);
      normalizedRangeTo.setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0,
      );

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }

    setSelectedPreset(undefined);
  };

  const resetValues = (): void => {
    setRange({
      from:
        typeof initialDateFrom === "string"
          ? new Date(initialDateFrom)
          : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === "string"
          ? new Date(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === "string"
          ? new Date(initialDateFrom)
          : initialDateFrom,
    });
    setRangeCompare(
      initialCompareFrom
        ? {
            from:
              typeof initialCompareFrom === "string"
                ? new Date(initialCompareFrom)
                : initialCompareFrom,
            to: initialCompareTo
              ? typeof initialCompareTo === "string"
                ? new Date(initialCompareTo)
                : initialCompareTo
              : typeof initialCompareFrom === "string"
                ? new Date(initialCompareFrom)
                : initialCompareFrom,
          }
        : undefined,
    );
  };

  useEffect(() => {
    checkPreset();
  }, [range]);

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
  }): JSX.Element => (
    <Button
      className={cn(
        // "dark:hover:text-background ",
        isSelected && "pointer-events-none",
      )}
      variant="ghost"
      onClick={() => {
        setPreset(preset);
      }}
    >
      <>
        <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
          <CheckIcon width={18} height={18} />
        </span>
        {label}
      </>
    </Button>
  );

  // Helper function to check if two date ranges are equal
  const areRangesEqual = (a?: DateRange, b?: DateRange) => {
    if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
    return (
      a.from.getTime() === b.from.getTime() &&
      (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    );
  };

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
      openedRangeCompareRef.current = rangeCompare;
    }
  }, [isOpen]);

  const triggerButton = (
    <div
      className={cn(
        "inline-flex items-center space-x-2 rounded-md border border-gray-200 px-2",
        className,
      )}
    >
      {labelShown && (
        <span className="text-muted-foreground ml-2 whitespace-nowrap font-semibold text-gray-600">
          {label || t("dateRange")}
        </span>
      )}
      <Button
        variant={buttonVariant as VariantKey}
        className="min-w-[180px] rounded-full border-0 bg-transparent p-0 !shadow-none hover:bg-transparent focus:bg-transparent"
        style={{ boxShadow: "none" }}
        tabIndex={0}
      >
        <div className="flex w-full min-w-[160px] items-center justify-between gap-2 text-right">
          <span>
            {`${formatDate(range.from, locale)}${
              range.to != null ? " - " + formatDate(range.to, locale) : ""
            }`}
          </span>
          <span className="pl-2">
            {isOpen
              ? (suffixIcon ?? <ChevronUpIcon width={16} />)
              : (suffixIcon ?? <ChevronDownIcon width={16} />)}
          </span>
        </div>
      </Button>
    </div>
  );

  const calendarContent = (
    <div className="flex py-2">
      <div className="flex">
        <div className="flex flex-col">
          <div className="flex flex-col items-center justify-center gap-2 px-3 pb-4 lg:flex-row lg:items-start lg:pb-0">
            <div className="flex items-center space-x-2 py-1 pr-4">
              {showCompare && (
                <>
                  <Switch
                    defaultChecked={Boolean(rangeCompare)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        if (!range.to) {
                          setRange({
                            from: range.from,
                            to: range.from,
                          });
                        }
                        setRangeCompare({
                          from: new Date(
                            range.from.getFullYear(),
                            range.from.getMonth(),
                            range.from.getDate() - 365,
                          ),
                          to: range.to
                            ? new Date(
                                range.to.getFullYear() - 1,
                                range.to.getMonth(),
                                range.to.getDate(),
                              )
                            : new Date(
                                range.from.getFullYear() - 1,
                                range.from.getMonth(),
                                range.from.getDate(),
                              ),
                        });
                      } else {
                        setRangeCompare(undefined);
                      }
                    }}
                    id="compare-mode"
                  />
                  <Label htmlFor="compare-mode">Compare</Label>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <DateInput
                  key={range.from.toISOString()}
                  value={range.from}
                  onChange={(date) => {
                    const toDate =
                      range.to == null || date > range.to ? date : range.to;
                    setRange((prevRange) => ({
                      ...prevRange,
                      from: date,
                      to: toDate,
                    }));
                  }}
                />
                <div className="py-1">-</div>
                <DateInput
                  key={range.to?.toISOString() ?? "to-empty"}
                  value={range.to}
                  onChange={(date) => {
                    const fromDate = date < range.from ? date : range.from;
                    setRange((prevRange) => ({
                      ...prevRange,
                      from: fromDate,
                      to: date,
                    }));
                  }}
                />
              </div>
              {rangeCompare != null && (
                <div className="flex gap-2">
                  <DateInput
                    key={rangeCompare.from.toISOString()}
                    value={rangeCompare?.from}
                    onChange={(date) => {
                      if (rangeCompare) {
                        const compareToDate =
                          rangeCompare.to == null || date > rangeCompare.to
                            ? date
                            : rangeCompare.to;
                        setRangeCompare((prevRangeCompare) => ({
                          ...prevRangeCompare,
                          from: date,
                          to: compareToDate,
                        }));
                      } else {
                        setRangeCompare({
                          from: date,
                          to: new Date(),
                        });
                      }
                    }}
                  />
                  <div className="py-1">-</div>
                  <DateInput
                    key={rangeCompare.to?.toISOString() ?? "compare-to-empty"}
                    value={rangeCompare?.to}
                    onChange={(date) => {
                      if (rangeCompare && rangeCompare.from) {
                        const compareFromDate =
                          date < rangeCompare.from ? date : rangeCompare.from;
                        setRangeCompare({
                          ...rangeCompare,
                          from: compareFromDate,
                          to: date,
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {isMobile && (
            <Select
              defaultValue={selectedPreset}
              onValueChange={(value) => {
                setPreset(value);
              }}
            >
              <SelectTrigger className="mx-auto mb-2 w-[180px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div>
            <Calendar
              locale={calendarLocale}
              mode="range"
              onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                if (!value?.from) {
                  return;
                }
                let derivedTo;
                if (!value?.to) {
                  // User selected single day only
                  derivedTo = new Date(value.from.getTime());
                } else {
                  // User selected from day and to day
                  derivedTo = new Date(value.to.getTime());
                }
                derivedTo = new Date(derivedTo.setHours(23, 59, 59, 999));
                const derivedFrom = new Date(value.from.setHours(0, 0, 0, 0));
                setRange({ from: derivedFrom, to: derivedTo });
              }}
              selected={range}
              numberOfMonths={isMobile ? 1 : 2}
              defaultMonth={
                new Date(
                  new Date().setMonth(
                    new Date().getMonth() - (isMobile ? 0 : 1),
                  ),
                )
              }
            />
          </div>
        </div>
      </div>
      {!isMobile && (
        <div className="flex flex-col items-end gap-1 pb-6 pl-6 pr-2">
          <div className="flex w-full flex-col items-end gap-1 pb-6 pl-6 pr-2">
            {PRESETS.map((preset) => (
              <PresetButton
                key={preset.name}
                preset={preset.name}
                label={preset.label}
                isSelected={selectedPreset === preset.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return isMobile ? (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md rounded-lg p-0">
        <div className="px-4 pb-4">
          {calendarContent}
          <div className="flex justify-end gap-2 py-2">
            <Button
              onClick={() => {
                setIsOpen(false);
                resetValues();
              }}
              variant="ghost"
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleUpdate}>{t("update")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-auto"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleUpdate();
          }
        }}
      >
        {calendarContent}
        <div className="flex justify-end gap-2 py-2 pr-4">
          <Button
            onClick={() => {
              setIsOpen(false);
              resetValues();
            }}
            variant="ghost"
          >
            {t("cancel")}
          </Button>
          <Button onClick={handleUpdate}>{t("update")}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = "DateRangePicker";
