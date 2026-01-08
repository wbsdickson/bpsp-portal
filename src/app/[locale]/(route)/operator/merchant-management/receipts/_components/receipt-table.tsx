"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/lib/store";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useReceiptStore } from "@/store/receipt-store";
import ActionsCell from "@/components/action-cell";
import { useBasePath } from "@/hooks/use-base-path";

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

  const columns = React.useMemo<ColumnDef<ReceiptRow>[]>(
    () => [
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <ActionsCell<ReceiptRow>
            item={row.original}
            actions={[
              {
                title: t("actions.view"),
                onPress: (item) => onOpenDetail(item),
              },
              {
                title: t("actions.edit"),
                onPress: (item) => onOpenEdit(item),
              },
              {
                title: t("actions.delete"),
                variant: "destructive",
                onPress: (item) => onDelete(item),
              },
            ]}
            t={t}
          />
        ),
      },
      {
        accessorKey: "receiptNumber",
        header: t("columns.receiptNumber"),
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="h-8 px-2 font-medium"
            onClick={() => addTab(row.original.id)}
          >
            {String(row.getValue("receiptNumber") ?? "")}
          </Button>
        ),
      },
      {
        accessorKey: "clientName",
        header: t("columns.client"),
        cell: ({ row }) => (
          <div>{String(row.getValue("clientName") ?? "")}</div>
        ),
      },
      {
        id: "amount",
        header: t("columns.amount"),
        cell: ({ row }) => {
          const rc = row.original;
          return (
            <div className="font-medium">{`${getCurrencySymbol(rc.currency)} ${formattedAmount(
              rc.amount,
              rc.currency,
            )}`}</div>
          );
        },
      },
      {
        accessorKey: "issueDate",
        header: t("columns.issueDate"),
        cell: ({ row }) => <div>{String(row.getValue("issueDate") ?? "")}</div>,
      },
      {
        accessorKey: "status",
        header: t("columns.status"),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const rowValue = row.getValue(columnId);

          if (Array.isArray(filterValue)) {
            if (filterValue.length === 0) return true;
            return filterValue.includes(String(rowValue));
          }

          return String(rowValue) === String(filterValue);
        },
        cell: ({ row }) => {
          const value = String(row.getValue("status") ?? "");
          if (value === "issued") {
            return (
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700"
              >
                issued
              </Badge>
            );
          }
          if (value === "draft") {
            return <Badge variant="secondary">draft</Badge>;
          }
          return <Badge variant="outline">{value || "—"}</Badge>;
        },
      },
    ],
    [addTab, deleteReceipt, locale, router, t],
  );

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={columns}
        data={rows}
        renderToolbar={(table) => {
          const receiptNumberCol = table.getColumn("receiptNumber");
          const clientNameCol = table.getColumn("clientName");
          const issueDateCol = table.getColumn("issueDate");
          const statusCol = table.getColumn("status");

          const statusOptions = [
            { value: "draft", label: "draft" },
            { value: "issued", label: "issued" },
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
