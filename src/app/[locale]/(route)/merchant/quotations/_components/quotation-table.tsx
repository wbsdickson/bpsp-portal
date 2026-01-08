"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import type { QuotationStatus } from "@/lib/types";
import { useClientStore } from "@/store/client-store";
import { useQuotationStore } from "@/store/merchant/quotation-store";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import useQuotationTableColumn, {
  type QuotationRow,
} from "../_hook/use-table-column";
import { DateRangePicker } from "@/components/date-range-picker";
import { asDateValue, formatDate, toYmd } from "@/lib/date-utils";

const STATUS_OPTIONS: QuotationStatus[] = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
];

export default function QuotationTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.Quotations");

  const quotations = useQuotationStore((s) => s.quotations);
  const clients = useClientStore((s) => s.clients);

  const [quotationDateFrom, setQuotationDateFrom] = React.useState<string>("");
  const [quotationDateTo, setQuotationDateTo] = React.useState<string>("");
  const quotationDateFromValue = asDateValue(quotationDateFrom);
  const quotationDateToValue = asDateValue(quotationDateTo);

  const rows: QuotationRow[] = React.useMemo(() => {
    const clientNameById = new Map(
      clients.filter((c) => !c.deletedAt).map((c) => [c.id, c.name] as const),
    );

    return quotations
      .filter((q) => !q.deletedAt)
      .map((q) => {
        const issueDateLabel = q.quotationDate
          ? (() => {
              const dt = new Date(q.quotationDate);
              return Number.isNaN(dt.getTime())
                ? q.quotationDate
                : dt.toLocaleDateString();
            })()
          : "—";

        return {
          ...q,
          clientName: clientNameById.get(q.clientId) ?? "—",
          issueDateLabel,
        };
      });
  }, [clients, quotations]);

  const { column } = useQuotationTableColumn({ addTab });

  return (
    <div className="space-y-3">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const clientCol = table.getColumn("clientName");
          const issueDateCol = table.getColumn("issueDateLabel");
          const statusCol = table.getColumn("status");

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
                  label={t("filters.client")}
                  value={String(clientCol?.getFilterValue() ?? "")}
                  onChange={(v) => clientCol?.setFilterValue(v)}
                />

                <FilterChipMultiSelectPopover
                  label={t("filters.status")}
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

                <DateRangePicker
                  label={t("filters.quotationDate")}
                  initialDateFrom={asDateValue(
                    quotationDateFromValue ? toYmd(quotationDateFromValue) : "",
                  )}
                  initialDateTo={asDateValue(
                    quotationDateToValue ? toYmd(quotationDateToValue) : "",
                  )}
                  onUpdate={({ range }) => {
                    setQuotationDateFrom(range?.from ? toYmd(range.from) : "");
                    setQuotationDateTo(range?.to ? toYmd(range.to) : "");
                  }}
                  align="start"
                />

                <Button
                  
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
