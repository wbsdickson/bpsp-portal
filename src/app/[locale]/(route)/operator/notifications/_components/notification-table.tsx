"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMerchantStore } from "@/store/merchant-store";
import { useNotificationStore } from "@/store/notification-store";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import useNotificationTableColumn, {
  type NotificationRow,
  type PublicationStatus,
} from "../_hook/use-table-column";

const STATUS_OPTIONS: PublicationStatus[] = [
  "scheduled",
  "published",
  "expired",
];

function formatDateTimeLabel(input?: string) {
  if (!input) return "—";
  const dt = new Date(input);
  if (Number.isNaN(dt.getTime())) return input;
  return dt.toLocaleString();
}

function computePublicationStatus(n: {
  publicationStartDate?: string;
  publicationEndDate?: string;
}): PublicationStatus {
  const now = new Date();
  const start = n.publicationStartDate
    ? new Date(n.publicationStartDate)
    : undefined;
  const end = n.publicationEndDate ? new Date(n.publicationEndDate) : undefined;

  const startValid =
    start && !Number.isNaN(start.getTime()) ? start : undefined;
  const endValid = end && !Number.isNaN(end.getTime()) ? end : undefined;

  if (startValid && startValid.getTime() > now.getTime()) return "scheduled";
  if (endValid && endValid.getTime() < now.getTime()) return "expired";
  return "published";
}

export default function NotificationTable({
  addTab,
}: {
  addTab?: (id: string) => void;
}) {
  const safeAddTab = addTab ?? (() => {});
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Notifications");

  const notifications = useNotificationStore((s) => s.notifications);
  const merchants = useMerchantStore((s) => s.merchants);

  const rows: NotificationRow[] = React.useMemo(() => {
    const merchantCount = merchants.length;

    return notifications
      .filter((n) => !n.deletedAt)
      .map((n) => {
        const publicationStatus = computePublicationStatus(n);
        const targetMerchantsCount = n.merchantId ? 1 : merchantCount;

        return {
          ...n,
          publicationStatus,
          publicationStartLabel: formatDateTimeLabel(n.publicationStartDate),
          publicationEndLabel: formatDateTimeLabel(n.publicationEndDate),
          targetMerchantsCount,
        };
      });
  }, [merchants.length, notifications]);

  const { column } = useNotificationTableColumn({ addTab: safeAddTab });

  return (
    <div className="space-y-3">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const titleCol = table.getColumn("title");
          const statusCol = table.getColumn("publicationStatus");

          const statusOptions = STATUS_OPTIONS.map((s) => ({
            value: s,
            label: t(`statuses.${s}`),
          }));

          const rawStatusValue = statusCol?.getFilterValue();
          const statusValues = Array.isArray(rawStatusValue)
            ? (rawStatusValue as string[])
            : rawStatusValue
              ? [String(rawStatusValue)]
              : [];

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.title")}
                  value={String(titleCol?.getFilterValue() ?? "")}
                  onChange={(v) => titleCol?.setFilterValue(v)}
                />

                <FilterChipMultiSelectPopover
                  label={t("filters.publicationStatus")}
                  values={statusValues}
                  options={statusOptions}
                  onChange={(vals) =>
                    statusCol?.setFilterValue(vals.length ? vals : undefined)
                  }
                  searchPlaceholder={t("filters.search")}
                  resetLabel={t("filters.reset")}
                  doneLabel={t("filters.done")}
                  placeholder={t("filters.all")}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 text-indigo-600 hover:text-indigo-700"
                  onClick={() => table.resetColumnFilters()}
                >
                  {t("buttons.clearFilters")}
                  <X className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
