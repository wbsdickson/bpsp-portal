"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import ActionsCell from "@/components/action-cell";
import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useAppStore } from "@/lib/store";
import { useInvoiceStore } from "@/store/invoice-store";
import { useBasePath } from "@/hooks/use-base-path";
import { useReceivedInvoiceStore } from "@/store/received-invoice-store";
import { InvoiceStatus } from "@/lib/types";
import useReceivedPayableInvoiceTableColumn from "../_hook/use-table-column";

export type PayableInvoiceRow = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  issueDate: string;
  paymentDueDate: string;
  status: string;
};

export default function ReceivedPayableInvoiceTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.ReceivedPayableInvoices");

  const clients = useAppStore((s) => s.clients);
  const invoices = useReceivedInvoiceStore((s) => s.invoices);
  const deleteInvoice = useReceivedInvoiceStore((s) => s.deleteInvoice);
  const { basePath } = useBasePath();

  const rows = React.useMemo<PayableInvoiceRow[]>(() => {
    return invoices
      .filter((inv) => !inv.deletedAt)
      .map((inv) => {
        const client = clients.find((c) => c.id === inv.clientId);
        const issueDate = inv.invoiceDate;
        return {
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          clientName: client?.name ?? "—",
          amount: inv.amount,
          currency: inv.currency,
          issueDate,
          paymentDueDate: inv.dueDate ?? "",
          status: inv.status,
        };
      });
  }, [clients, invoices]);

  const onOpenDetail = (item: PayableInvoiceRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: PayableInvoiceRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: PayableInvoiceRow) => {
    deleteInvoice(item.id);
  };

  const { column } = useReceivedPayableInvoiceTableColumn({ addTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const invoiceNumberCol = table.getColumn("invoiceNumber");
          const issueDateCol = table.getColumn("issueDate");
          const clientNameCol = table.getColumn("clientName");
          const statusCol = table.getColumn("status");

          const statusOptions = [
            { value: "draft", label: "draft" },
            { value: "pending", label: "pending" },
            { value: "approved", label: "approved" },
            { value: "paid", label: "paid" },
            { value: "rejected", label: "rejected" },
            { value: "void", label: "void" },
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
                  label={t("filters.invoiceNumber")}
                  value={String(invoiceNumberCol?.getFilterValue() ?? "")}
                  onChange={(v) => invoiceNumberCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.period")}
                  value={String(issueDateCol?.getFilterValue() ?? "")}
                  onChange={(v) => issueDateCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.client")}
                  value={String(clientNameCol?.getFilterValue() ?? "")}
                  onChange={(v) => clientNameCol?.setFilterValue(v)}
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
