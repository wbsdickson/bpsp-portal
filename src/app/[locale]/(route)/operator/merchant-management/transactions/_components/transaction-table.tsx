"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import type { PaymentStatus } from "@/lib/types";
import { useInvoiceStore } from "@/store/invoice-store";
import { useMerchantStore } from "@/store/merchant-store";
import { useClientStore } from "@/store/client-store";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import useTransactionTableColumn, {
  type Transaction,
} from "../_hook/use-table-column";
import DateRangePicker from "@/components/date-range-picker";
import { useTransactionStore } from "@/store/transaction-store";

const STATUS_OPTIONS: PaymentStatus[] = [
  "pending_approval",
  "settled",
  "failed",
];

function toYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function asDateValue(input: string | undefined) {
  if (!input) return undefined;
  const dt = new Date(input);
  if (Number.isNaN(dt.getTime())) return undefined;
  return dt;
}

export default function TransactionTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Transactions");

  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");

  const transactions = useTransactionStore((s) => s.transactions);
  const invoices = useInvoiceStore((s) => s.invoices);
  const merchants = useMerchantStore((s) => s.merchants);
  const clients = useClientStore((s) => s.clients);

  const rows: Transaction[] = React.useMemo(() => {
    const invoiceById = new Map(invoices.map((inv) => [inv.id, inv] as const));
    const merchantNameById = new Map(
      merchants.map((m) => [m.id, m.name ?? "—"] as const),
    );
    const clientNameById = new Map(
      clients.filter((c) => !c.deletedAt).map((c) => [c.id, c.name] as const),
    );

    const fromDt = asDateValue(fromDate);
    const toDt = asDateValue(toDate);

    return transactions
      .map((tx) => {
        const inv = invoiceById.get(tx.invoiceId);
        const clientId = inv?.clientId;

        const createdAtLabel = tx.createdAt
          ? (() => {
              const dt = new Date(tx.createdAt);
              return Number.isNaN(dt.getTime())
                ? tx.createdAt
                : dt.toLocaleString();
            })()
          : "—";

        return {
          ...tx,
          merchantName: merchantNameById.get(tx.merchantId) ?? "—",
          clientName:
            (clientId ? clientNameById.get(clientId) : undefined) ?? "—",
          transactionDateLabel: createdAtLabel,
        };
      })
      .filter((row) => {
        if (!fromDt && !toDt) return true;
        const dt = asDateValue(row.createdAt);
        if (!dt) return true;
        if (fromDt && dt.getTime() < fromDt.getTime()) return false;
        if (toDt) {
          const end = new Date(toDt);
          end.setHours(23, 59, 59, 999);
          if (dt.getTime() > end.getTime()) return false;
        }
        return true;
      });
  }, [clients, fromDate, invoices, merchants, toDate, transactions]);

  const { columns } = useTransactionTableColumn({ addTab });

  return (
    <div className="space-y-3">
      <DataTable
        columns={columns}
        data={rows}
        renderToolbar={(table) => {
          const merchantCol = table.getColumn("merchantName");
          const clientCol = table.getColumn("clientName");
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
                <div className="flex items-center gap-2">
                  <DateRangePicker
                    initialDateFrom={asDateValue(fromDate)}
                    initialDateTo={asDateValue(toDate)}
                    onUpdate={({ range }) => {
                      setFromDate(range?.from ? toYmd(range.from) : "");
                      setToDate(range?.to ? toYmd(range.to) : "");
                    }}
                    align="start"
                  />
                </div>

                <FilterChipPopover
                  label={t("filters.merchant")}
                  value={String(merchantCol?.getFilterValue() ?? "")}
                  onChange={(v) => merchantCol?.setFilterValue(v)}
                />

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

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 text-indigo-600 hover:text-indigo-700"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    table.resetColumnFilters();
                  }}
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
