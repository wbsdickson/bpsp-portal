"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import type { QuotationStatus } from "@/lib/types";
import { useClientStore } from "@/store/client-store";
import { useQuotationStore } from "@/store/quotation-store";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import useQuotationTableColumn, {
  type QuotationRow,
} from "../_hook/use-table-column";

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
  const t = useTranslations("Operator.Quotations");

  const quotations = useQuotationStore((s) => s.quotations);
  const clients = useClientStore((s) => s.clients);

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
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const numberCol = table.getColumn("quotationNumber");
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
                  label={t("filters.number")}
                  value={String(numberCol?.getFilterValue() ?? "")}
                  onChange={(v) => numberCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.client")}
                  value={String(clientCol?.getFilterValue() ?? "")}
                  onChange={(v) => clientCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("columns.quotationDate")}
                  value={String(issueDateCol?.getFilterValue() ?? "")}
                  onChange={(v) => issueDateCol?.setFilterValue(v)}
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
