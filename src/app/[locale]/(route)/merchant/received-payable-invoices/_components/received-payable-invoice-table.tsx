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
import { useBasePath } from "@/hooks/use-base-path";
import { useReceivedInvoiceStore } from "@/store/merchant/received-invoice-store";
import { toYmd } from "@/lib/date-utils";
import DateRangePicker from "@/components/date-range-picker";
import { asDateValue } from "@/lib/date-utils";

export type PayableInvoiceRow = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  issueDate: string;
  invoiceDate: string;
  status: string;
  paymentMethod: string;
};

function getStatusBadge(value: string) {
  const t = useTranslations("Merchant.ReceivedPayableInvoices");
  if (value === "paid") {
    return (
      <Badge
        variant="outline-success"
        className="bg-emerald-50 text-emerald-700"
      >
        {t("paid")}
      </Badge>
    );
  }
  if (value === "pending") {
    return (
      <Badge variant="outline-warning" className="bg-amber-50 text-amber-700">
        {t("pending")}
      </Badge>
    );
  }
  if (value === "draft") {
    return <Badge variant="outline-warning">{t("draft")}</Badge>;
  }
  if (value === "approved") {
    return (
      <Badge variant="outline-success" className="bg-indigo-50 text-indigo-700">
        {t("approved")}
      </Badge>
    );
  }
  if (value === "rejected") {
    return <Badge variant="outline-destructive">{t("rejected")}</Badge>;
  }
  if (value === "void") {
    return <Badge variant="outline-info">{t("void")}</Badge>;
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
  const t = useTranslations("Merchant.ReceivedPayableInvoices");

  const clients = useAppStore((s) => s.clients);

  const [invoiceDateFrom, setInvoiceDateFrom] = React.useState<string>("");
  const [invoiceDateTo, setInvoiceDateTo] = React.useState<string>("");
  const invoiceDateFromValue = asDateValue(invoiceDateFrom);
  const invoiceDateToValue = asDateValue(invoiceDateTo);
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
          paymentMethod: inv.paymentMethod ?? "",
          status: inv.status,
          invoiceDate: inv.invoiceDate,
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
        accessorKey: "invoiceDate",
        header: t("columns.invoiceDate"),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const rowValue = row.getValue(columnId);

          if (Array.isArray(filterValue)) {
            if (filterValue.length === 0) return true;
            return filterValue.includes(String(rowValue).slice(0, 7));
          }

          return String(rowValue).slice(0, 7) === String(filterValue);
        },
        cell: ({ row }) => (
          <div>{String(row.getValue("invoiceDate") ?? "")}</div>
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
        cell: ({ row }) => getStatusBadge(String(row.getValue("status") ?? "")),
      },
      {
        accessorKey: "paymentMethod",
        header: t("columns.paymentMethod"),
        cell: ({ row }) => (
          <div>{String(row.getValue("paymentMethod") ?? "")}</div>
        ),
      },
      {
        id: "actions",
        header: t("columns.actions"),
        size: 100,
        enableHiding: false,
        cell: ({ row }) => (
          <ActionsCell<PayableInvoiceRow>
            item={row.original}
            onOpenDetail={onOpenDetail}
            onOpenEdit={onOpenEdit}
            onDelete={onDelete}
            t={t}
            variant="verbose"
          />
        ),
      },
    ],
    [addTab, deleteInvoice, locale, router, t],
  );

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={columns}
        data={rows}
        renderToolbar={(table) => {
          const clientNameCol = table.getColumn("clientName");
          const statusCol = table.getColumn("status");

          const directionCol = table.getColumn("direction");
          const directionOptions = [
            { value: "receivable", label: "receivable" },
            { value: "payable", label: "payable" },
          ];

          const rawDirectionValue = directionCol?.getFilterValue();
          const directionValues = Array.isArray(rawDirectionValue)
            ? (rawDirectionValue as string[])
            : rawDirectionValue
              ? [String(rawDirectionValue)]
              : [];

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

                <DateRangePicker
                  label={t("filters.invoiceDate")}
                  initialDateFrom={asDateValue(
                    invoiceDateFromValue ? toYmd(invoiceDateFromValue) : "",
                  )}
                  initialDateTo={asDateValue(
                    invoiceDateToValue ? toYmd(invoiceDateToValue) : "",
                  )}
                  onUpdate={({ range }) => {
                    setInvoiceDateFrom(range?.from ? toYmd(range.from) : "");
                    setInvoiceDateTo(range?.to ? toYmd(range.to) : "");
                  }}
                  align="start"
                />

                <FilterChipMultiSelectPopover
                  label={t("filters.direction")}
                  values={directionValues}
                  options={directionOptions}
                  onChange={(vals) =>
                    directionCol?.setFilterValue(vals.length ? vals : undefined)
                  }
                  searchPlaceholder={t("filters.search")}
                  resetLabel={t("filters.reset")}
                  doneLabel={t("filters.done")}
                  placeholder={t("filters.all")}
                />

                <Button size="sm" onClick={() => table.resetColumnFilters()}>
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
