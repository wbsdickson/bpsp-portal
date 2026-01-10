"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMerchantStore } from "@/store/merchant-store";
import { useNotificationStore } from "@/store/merchant/notification-store";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import useNotificationTableColumn, {
  type NotificationRow,
  type PublicationStatus,
} from "../_hook/use-table-column";
import DateRangePicker from "@/components/date-range-picker";
import { useState } from "react";
import { asDateValue, toYmd } from "@/lib/date-utils";

const STATUS_OPTIONS: string[] = ["read", "unread"];

function formatDateTimeLabel(input?: string) {
  if (!input) return "—";
  const dt = new Date(input);
  if (Number.isNaN(dt.getTime())) return input;
  return dt.toLocaleString();
}

function computePublicationStatus(n: {
  publicationDate?: string;
}): PublicationStatus {
  const now = new Date();
  const publicationDate = n.publicationDate
    ? new Date(n.publicationDate)
    : undefined;
  if (publicationDate && !Number.isNaN(publicationDate.getTime())) {
    return publicationDate.getTime() > now.getTime()
      ? "scheduled"
      : "published";
  }
  return "expired";
}

export default function NotificationTable({
  addTab,
}: {
  addTab?: (id: string) => void;
}) {
  const safeAddTab = addTab ?? (() => {});
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.Notifications");

  const notifications = useNotificationStore((s) => s.notifications);
  const merchants = useMerchantStore((s) => s.merchants);

  const [publicationDateFromValue, setPublicationDateFrom] =
    useState<string>("");
  const [publicationDateToValue, setPublicationDateTo] = useState<string>("");

  const publicationDateFrom = asDateValue(publicationDateFromValue);
  const publicationDateTo = asDateValue(publicationDateToValue);

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
          publicationDateLabel: formatDateTimeLabel(n.publicationDate),
          target: n.target ?? "",
          targetMerchantsCount,
          readStatus: n.readStatus ?? false,
          createdBy: n.createdBy ?? "",
          createdAt: n.createdAt ?? "",
          updatedAt: n.updatedAt ?? "",
          deletedAt: n.deletedAt ?? null,
        };
      });
  }, [merchants.length, notifications]);

  const { column } = useNotificationTableColumn({ addTab: safeAddTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const titleCol = table.getColumn("title");
          const readStatusCol = table.getColumn("readStatus");

          const statusOptions = STATUS_OPTIONS.map((s) => ({
            value: s,
            label: t(`statuses.${s}`),
          }));

          const rawStatusValue = readStatusCol?.getFilterValue();
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

                <DateRangePicker
                  label={t("filters.publicationPeriod")}
                  initialDateFrom={asDateValue(
                    publicationDateFrom ? toYmd(publicationDateFrom) : "",
                  )}
                  initialDateTo={asDateValue(
                    publicationDateTo ? toYmd(publicationDateTo) : "",
                  )}
                  onUpdate={({ range }) => {
                    setPublicationDateFrom(
                      range?.from ? toYmd(range.from) : "",
                    );
                    setPublicationDateTo(range?.to ? toYmd(range.to) : "");
                  }}
                  align="start"
                />

                <FilterChipMultiSelectPopover
                  label={t("filters.readStatus")}
                  values={statusValues}
                  options={statusOptions}
                  onChange={(vals) =>
                    readStatusCol?.setFilterValue(
                      vals.length ? vals : undefined,
                    )
                  }
                  searchPlaceholder={t("filters.search")}
                  resetLabel={t("filters.reset")}
                  doneLabel={t("filters.done")}
                  placeholder={t("filters.all")}
                />

                <Button
                  variant="ghost-primary"
                  size="sm"
                  onClick={() => table.resetColumnFilters()}
                >
                  {t("buttons.clearFilters")}
                </Button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
