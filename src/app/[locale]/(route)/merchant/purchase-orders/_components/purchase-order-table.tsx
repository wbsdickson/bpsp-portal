"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import type { QuotationStatus } from "@/lib/types";
import { useClientStore } from "@/store/client-store";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import usePurchaseOrderTableColumn, {
  type PurchaseOrderRow,
} from "../_hook/use-table-column";
import { DateRangePicker } from "@/components/date-range-picker";
import { asDateValue, formatDate, toYmd } from "@/lib/date-utils";
import { usePurchaseOrderStore } from "@/store/merchant/purchase-order-store";

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
  const t = useTranslations("Merchant.PurchaseOrders");

  const purchaseOrders = usePurchaseOrderStore((s) => s.purchaseOrders);
  const clients = useClientStore((s) => s.clients);

  const [purchaseOrderDateFrom, setPurchaseOrderDateFrom] =
    React.useState<string>("");
  const [purchaseOrderDateTo, setPurchaseOrderDateTo] =
    React.useState<string>("");
  const purchaseOrderDateFromValue = asDateValue(purchaseOrderDateFrom);
  const purchaseOrderDateToValue = asDateValue(purchaseOrderDateTo);

  const rows: PurchaseOrderRow[] = React.useMemo(() => {
    const clientNameById = new Map(
      clients.filter((c) => !c.deletedAt).map((c) => [c.id, c.name] as const),
    );

    return purchaseOrders
      .filter((po) => !po.deletedAt)
      .map((po) => {
        const issueDateLabel = po.poDate;

        return {
          ...po,
          clientName: clientNameById.get(po.clientId) ?? "—",
          issueDateLabel,
        };
      });
  }, [clients, purchaseOrders]);

  const { column } = usePurchaseOrderTableColumn({ addTab });

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
                  label={t("filters.purchaseOrderDate")}
                  initialDateFrom={asDateValue(
                    purchaseOrderDateFromValue
                      ? toYmd(purchaseOrderDateFromValue)
                      : "",
                  )}
                  initialDateTo={asDateValue(
                    purchaseOrderDateToValue
                      ? toYmd(purchaseOrderDateToValue)
                      : "",
                  )}
                  onUpdate={({ range }) => {
                    setPurchaseOrderDateFrom(
                      range?.from ? toYmd(range.from) : "",
                    );
                    setPurchaseOrderDateTo(range?.to ? toYmd(range.to) : "");
                  }}
                  align="start"
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
