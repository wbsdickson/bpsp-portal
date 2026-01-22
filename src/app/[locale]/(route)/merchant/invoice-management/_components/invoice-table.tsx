"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
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
import { useTranslations } from "next-intl";
import useMerchantInvoiceTableColumn from "../_hooks/use-table-column";
import { useInvoiceStore } from "@/store/merchant/invoice-store";
import { DateRangePicker } from "@/components/date-range-picker";

function ActionsCell({ id }: { id: string }) {
  const locale = useLocale();
  const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice);
  const t = useTranslations("Merchant.InvoiceManagement");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{t("open_menu")}</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/merchant/invoice-management/edit/${id}`}>
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
      className="hover:bg-secondary text-center hover:underline"
    >
      {invoiceNumber}
    </Button>
  );
}

type InvoiceRow = {
  id: string;
  total: number;
  currency: string;
  status:
  | "draft"
  | "pending"
  | "approved"
  | "paid"
  | "rejected"
  | "void"
  | "past_due"
  | "open";
  frequency?: string;
  invoiceNumber: string;
  merchantName: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  created: string;
  invoiceDate: string;
  dueDate: string;
};

function asDateValue(input: string | undefined) {
  if (!input) return undefined;
  const dt = new Date(input);
  if (Number.isNaN(dt.getTime())) return undefined;
  return dt;
}

function toYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function InvoiceTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const router = useRouter();
  const t = useTranslations("Merchant.InvoiceManagement");

  const clients = useAppStore((s) => s.clients);
  const merchants = useAppStore((s) => s.merchants);
  const storeInvoices = useInvoiceStore((s) => s.invoices);

  const [invoiceDateFrom, setInvoiceDateFrom] = React.useState<string>("");
  const [invoiceDateTo, setInvoiceDateTo] = React.useState<string>("");
  const [dueDateFrom, setDueDateFrom] = React.useState<string>("");
  const [dueDateTo, setDueDateTo] = React.useState<string>("");

  const invoiceDateFromValue = asDateValue(invoiceDateFrom);
  const invoiceDateToValue = asDateValue(invoiceDateTo);
  const dueDateFromValue = asDateValue(dueDateFrom);
  const dueDateToValue = asDateValue(dueDateTo);

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
          status: inv.status,
          frequency: "",
          invoiceNumber: inv.invoiceNumber,
          merchantName: merchant?.name ?? "—",
          customerName: client?.name ?? inv.recipientName ?? "—",
          customerEmail: client?.email ?? "",
          issueDate: inv.invoiceDate,
          created: inv.createdAt,
          invoiceDate: inv.invoiceDate ?? "",
          dueDate: inv.dueDate ?? "",
        };
      });
  }, [clients, merchants, storeInvoices]);

  const { column } = useMerchantInvoiceTableColumn({ addTab });

  return (
    <>
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const invoiceNumberCol = table.getColumn("invoiceNumber");
          const billingRecipientCol = table.getColumn("billingRecipient");

          const statusCol = table.getColumn("status");

          const statusOptions = [
            { value: "open", label: t("statusOpen") },
            { value: "draft", label: t("statusDraft") },
            { value: "pending", label: t("statusPending") },
            { value: "approved", label: t("statusApproved") },
            { value: "rejected", label: t("statusRejected") },
            { value: "void", label: t("statusVoid") },
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
                  label={t("billingRecipient")}
                  value={String(billingRecipientCol?.getFilterValue() ?? "")}
                  onChange={(v) => billingRecipientCol?.setFilterValue(v)}
                />

                <FilterChipMultiSelectPopover
                  label={t("status")}
                  values={statusValues}
                  options={statusOptions}
                  onChange={(vals) =>
                    statusCol?.setFilterValue(vals.length ? vals : undefined)
                  }
                  searchPlaceholder={t("filters.search")}
                  resetLabel={t("filters.reset")}
                  doneLabel={t("filters.done")}
                  placeholder="All"
                />
                <DateRangePicker
                  label={t("invoiceDate")}
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
                <DateRangePicker
                  label={t("dueDate")}
                  initialDateFrom={asDateValue(
                    dueDateFromValue ? toYmd(dueDateFromValue) : "",
                  )}
                  initialDateTo={asDateValue(
                    dueDateToValue ? toYmd(dueDateToValue) : "",
                  )}
                  onUpdate={({ range }) => {
                    setDueDateFrom(range?.from ? toYmd(range.from) : "");
                    setDueDateTo(range?.to ? toYmd(range.to) : "");
                  }}
                  align="start"
                />
                {/* <Button variant="outline" size="sm" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t("moreFilters")}
                  </Button> */}

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
    </>
  );
}
