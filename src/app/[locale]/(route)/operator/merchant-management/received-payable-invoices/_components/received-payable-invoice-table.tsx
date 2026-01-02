"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import ActionsCell from "../../_components/action-cell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useAppStore } from "@/lib/store";
import { useInvoiceStore } from "@/store/invoice-store";
import { useBasePath } from "@/hooks/use-base-path";

type PayableInvoiceRow = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  issueDate: string;
  paymentDueDate: string;
  status: string;
};

function StatusBadge({ value }: { value: string }) {
  if (value === "paid") {
    return (
      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
        paid
      </Badge>
    );
  }
  if (value === "pending") {
    return (
      <Badge variant="secondary" className="bg-amber-50 text-amber-700">
        pending
      </Badge>
    );
  }
  if (value === "draft") {
    return <Badge variant="secondary">draft</Badge>;
  }
  if (value === "approved") {
    return (
      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
        approved
      </Badge>
    );
  }
  if (value === "rejected") {
    return <Badge variant="destructive">rejected</Badge>;
  }
  if (value === "void") {
    return <Badge variant="outline">void</Badge>;
  }
  return <Badge variant="outline">{value || "—"}</Badge>;
}

export default function ReceivedPayableInvoiceTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.ReceivedPayableInvoices");

  const clients = useAppStore((s) => s.clients);
  const invoices = useInvoiceStore((s) => s.invoices);
  const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice);
  const { basePath } = useBasePath();

  const rows = React.useMemo<PayableInvoiceRow[]>(() => {
    return invoices
      .filter((inv) => !inv.deletedAt)
      .filter((inv) => inv.direction === "payable")
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

  const columns = React.useMemo<ColumnDef<PayableInvoiceRow>[]>(
    () => [
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <ActionsCell<PayableInvoiceRow>
            item={row.original}
            onOpenDetail={onOpenDetail}
            onOpenEdit={onOpenEdit}
            onDelete={onDelete}
            t={t}
          />
        ),
      },
      {
        accessorKey: "invoiceNumber",
        header: t("columns.invoiceNumber"),
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="h-8 px-2 font-medium"
            onClick={() => addTab(row.original.id)}
          >
            {String(row.getValue("invoiceNumber") ?? "")}
          </Button>
        ),
      },
      {
        accessorKey: "clientName",
        header: t("columns.clientName"),
        cell: ({ row }) => (
          <div>{String(row.getValue("clientName") ?? "")}</div>
        ),
      },
      {
        id: "amount",
        header: t("columns.amount"),
        cell: ({ row }) => {
          const inv = row.original;
          return (
            <div className="font-medium">{`${getCurrencySymbol(inv.currency)} ${formattedAmount(
              inv.amount,
              inv.currency,
            )}`}</div>
          );
        },
      },
      {
        accessorKey: "issueDate",
        header: t("columns.issueDate"),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const rowValue = row.getValue(columnId);

          if (Array.isArray(filterValue)) {
            if (filterValue.length === 0) return true;
            return filterValue.includes(String(rowValue).slice(0, 7));
          }

          return String(rowValue).slice(0, 7) === String(filterValue);
        },
        cell: ({ row }) => <div>{String(row.getValue("issueDate") ?? "")}</div>,
      },
      {
        accessorKey: "paymentDueDate",
        header: t("columns.paymentDueDate"),
        cell: ({ row }) => {
          const value = String(row.getValue("paymentDueDate") ?? "");
          return <div>{value || "—"}</div>;
        },
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
        cell: ({ row }) => (
          <StatusBadge value={String(row.getValue("status") ?? "")} />
        ),
      },
    ],
    [addTab, deleteInvoice, locale, router, t],
  );

  return (
    <div className="space-y-3">
      <DataTable
        columns={columns}
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
