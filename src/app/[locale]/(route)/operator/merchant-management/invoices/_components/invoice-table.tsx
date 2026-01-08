"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import { useInvoiceStore } from "@/store/invoice-store";
import { useTranslations } from "next-intl";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import useMerchantInvoiceTableColumn from "../_hooks/use-table-column";

function ActionsCell({ id }: { id: string }) {
  const locale = useLocale();
  const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice);
  const t = useTranslations("Operator.Invoice");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/operator/invoices/edit/${id}`}>
            {t("editInvoice")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            const confirmed = window.confirm(t("deleteConfirm"));
            if (!confirmed) return;
            deleteInvoice(id);
          }}
        >
          {t("deleteInvoice")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function InvoiceNumberCell({
  id,
  invoiceNumber,
  addTab,
}: {
  id: string;
  invoiceNumber: string;
  addTab: () => void;
}) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={addTab}
      className="hover:bg-primary/10 block h-full text-left"
    >
      {invoiceNumber}
    </Button>
  );
}

type InvoiceRow = {
  id: string;
  total: number;
  currency: string;
  status: "open" | "draft" | "past_due" | "paid";
  frequency?: string;
  invoiceNumber: string;
  merchantName: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  created: string;
};

const columns = (
  t: ReturnType<typeof useTranslations>,
  addTab: (id: string) => void,
): ColumnDef<InvoiceRow>[] => [
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
  },
  {
    accessorKey: "invoiceNumber",
    header: t("invoiceNumber"),
    cell: ({ row }) => (
      <InvoiceNumberCell
        id={row.original.id}
        invoiceNumber={String(row.getValue("invoiceNumber") ?? "")}
        addTab={() => addTab(row.original.id)}
      />
    ),
  },
  {
    accessorKey: "merchantName",
    header: t("merchant"),
    cell: ({ row }) => <div>{row.getValue("merchantName")}</div>,
  },
  {
    accessorKey: "customerName",
    header: t("client"),
    cell: ({ row }) => <div>{row.getValue("customerName")}</div>,
  },
  {
    id: "amount",
    header: t("amount"),
    cell: ({ row }) => {
      const inv = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="font-medium">
            {`${getCurrencySymbol(inv.currency)} ${formattedAmount(
              inv.total,
              inv.currency,
            )}`}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "issueDate",
    header: t("issueDate"),
    cell: ({ row }) => <div>{row.getValue("issueDate")}</div>,
  },
  {
    id: "status",
    accessorKey: "status",
    header: t("status"),
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
      const inv = row.original;
      return (
        <div className="flex items-center gap-3">
          {inv.status === "open" && (
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
              {t("statusOpen")}
            </Badge>
          )}
          {inv.status === "draft" && (
            <Badge variant="secondary">{t("statusDraft")}</Badge>
          )}
          {inv.status === "past_due" && (
            <Badge variant="secondary" className="bg-amber-50 text-amber-700">
              {t("statusPastDue")}
            </Badge>
          )}
          {inv.status === "paid" && (
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700"
            >
              {t("statusPaid")}
            </Badge>
          )}
        </div>
      );
    },
  },
];

export default function InvoiceTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const router = useRouter();
  const t = useTranslations("Operator.Invoice");

  const clients = useAppStore((s) => s.clients);
  const merchants = useAppStore((s) => s.merchants);
  const storeInvoices = useInvoiceStore((s) => s.invoices);

  const rows = React.useMemo<InvoiceRow[]>(() => {
    return storeInvoices
      .filter((inv) => !inv.deletedAt)
      .map((inv) => {
        const client = clients.find((c) => c.id === inv.clientId);
        const merchant = merchants.find((m) => m.id === inv.merchantId);
        return {
          id: inv.id,
          total: inv.amount,
          currency: inv.currency,
          status:
            inv.status === "paid"
              ? "paid"
              : inv.status === "draft"
                ? "draft"
                : "open",
          frequency: "",
          invoiceNumber: inv.invoiceNumber,
          merchantName: merchant?.name ?? "—",
          customerName: client?.name ?? inv.recipientName ?? "—",
          customerEmail: client?.email ?? "",
          issueDate: inv.invoiceDate,
          created: inv.createdAt,
        };
      });
  }, [clients, merchants, storeInvoices]);

  const { column } = useMerchantInvoiceTableColumn({ addTab });

  return (
    <>
      <div className="space-y-3 p-4">
        <DataTable
          columns={column}
          data={rows}
          renderToolbar={(table) => {
            const invoiceNumberCol = table.getColumn("invoiceNumber");
            const merchantNameCol = table.getColumn("merchantName");
            const customerNameCol = table.getColumn("customerName");
            const statusCol = table.getColumn("status");

            const statusOptions = [
              { value: "open", label: t("statusOpen") },
              { value: "draft", label: t("statusDraft") },
              { value: "past_due", label: t("statusPastDue") },
              { value: "paid", label: t("statusPaid") },
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
                    label={t("invoiceNumber")}
                    value={String(invoiceNumberCol?.getFilterValue() ?? "")}
                    onChange={(v) => invoiceNumberCol?.setFilterValue(v)}
                  />
                  <FilterChipPopover
                    label={t("merchant")}
                    value={String(merchantNameCol?.getFilterValue() ?? "")}
                    onChange={(v) => merchantNameCol?.setFilterValue(v)}
                  />
                  <FilterChipPopover
                    label={t("client")}
                    value={String(customerNameCol?.getFilterValue() ?? "")}
                    onChange={(v) => customerNameCol?.setFilterValue(v)}
                  />

                  <FilterChipMultiSelectPopover
                    label={t("status")}
                    values={statusValues}
                    options={statusOptions}
                    onChange={(vals) =>
                      statusCol?.setFilterValue(vals.length ? vals : undefined)
                    }
                    searchPlaceholder="Search..."
                    resetLabel="Reset"
                    doneLabel="Done"
                    placeholder="All"
                  />

                  {/* <Button variant="outline" size="sm" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t("moreFilters")}
                  </Button> */}

                  <Button
                    
                    variant="ghost"
                    size="sm"
                    className="h-9 text-indigo-600 hover:text-indigo-700"
                    onClick={() => table.resetColumnFilters()}
                  >
                    {t("clearFilters")}
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
