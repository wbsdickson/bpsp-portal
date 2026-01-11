"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/lib/store";
import { useReceiptStore } from "@/store/receipt-store";
import { useBasePath } from "@/hooks/use-base-path";
import useReceiptTableColumn from "../_hook/use-table-column";

export type ReceiptRow = {
  id: string;
  receiptNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  issueDate: string;
  status: "draft" | "issued";
};

export default function ReceiptTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Receipt");
  const { basePath } = useBasePath();

  const clients = useAppStore((s) => s.clients);
  const receipts = useReceiptStore((s) => s.receipts);
  const deleteReceipt = useReceiptStore((s) => s.deleteReceipt);

  const rows = React.useMemo<ReceiptRow[]>(() => {
    return receipts
      .filter((rc) => !rc.deletedAt)
      .map((rc) => {
        const client = clients.find((c) => c.id === rc.clientId);
        return {
          id: rc.id,
          receiptNumber: rc.receiptNumber,
          clientName: client?.name ?? "—",
          amount: rc.amount,
          currency: rc.currency,
          issueDate: rc.issueDate,
          status: rc.status,
        };
      });
  }, [clients, receipts]);

  const onOpenDetail = (item: ReceiptRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: ReceiptRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: ReceiptRow) => {
    deleteReceipt(item.id);
  };

  const { column } = useReceiptTableColumn({ addTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const receiptNumberCol = table.getColumn("receiptNumber");
          const clientNameCol = table.getColumn("clientName");
          const issueDateCol = table.getColumn("issueDate");
          const statusCol = table.getColumn("status");

          const statusOptions = [
            { value: "draft", label: t("statuses.draft") },
            { value: "issued", label: t("statuses.issued") },
          ];

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
                  label={t("filters.receiptNumber")}
                  value={String(receiptNumberCol?.getFilterValue() ?? "")}
                  onChange={(v) => receiptNumberCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.client")}
                  value={String(clientNameCol?.getFilterValue() ?? "")}
                  onChange={(v) => clientNameCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.issueDate")}
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
