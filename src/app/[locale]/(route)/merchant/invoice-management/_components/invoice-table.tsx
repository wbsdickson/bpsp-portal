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
import { useTranslations } from "next-intl";
import useMerchantInvoiceTableColumn from "../_hooks/use-table-column";
import type { InvoiceRow } from "../_hooks/use-table-column";
import { DateRangePicker } from "@/components/date-range-picker";
import { useInvoicesApi } from "../_hooks/use-invoices-api";
import type { InvoiceStatus } from "@/types/invoice";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { asDateValue, toYmd } from "@/lib/date-utils";

export default function InvoiceTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const router = useRouter();
  const t = useTranslations("Merchant.InvoiceManagement");

  const clients = useAppStore((s) => s.clients);
  const merchants = useAppStore((s) => s.merchants);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<InvoiceStatus[]>([]);
  const [invoiceDateFrom, setInvoiceDateFrom] = React.useState<string>("");
  const [invoiceDateTo, setInvoiceDateTo] = React.useState<string>("");
  const [dueDateFrom, setDueDateFrom] = React.useState<string>("");
  const [dueDateTo, setDueDateTo] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<
    "invoiceNumber" | "invoiceDate" | "dueDate" | "amount"
  >("invoiceDate");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const { invoices, isLoading, isFetching, error, pagination, refetch } =
    useInvoicesApi({
      page,
      limit: pageSize,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      search: search || undefined,
      invoiceDateFrom: invoiceDateFrom || undefined,
      invoiceDateTo: invoiceDateTo || undefined,
      dueDateFrom: dueDateFrom || undefined,
      dueDateTo: dueDateTo || undefined,
      sortBy,
      sortOrder,
    });

  const rows = React.useMemo<InvoiceRow[]>(() => {
    return invoices.map((inv) => {
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
  }, [invoices, clients, merchants]);

  const { column } = useMerchantInvoiceTableColumn({ addTab });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter([]);
    setInvoiceDateFrom("");
    setInvoiceDateTo("");
    setDueDateFrom("");
    setDueDateTo("");
    setPage(1);
  };

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load invoices";
    return (
      <div className="space-y-3 p-4">
        <div className="border-destructive bg-destructive/10 rounded-lg border p-4">
          <p className="text-destructive font-medium">
            {t("errors.loadFailed") || "Failed to load invoices"}
          </p>
          <p className="text-destructive/80 mt-1 text-sm">{errorMessage}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void refetch()}
          >
            {t("buttons.retry") || "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading || isFetching ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          <DataTable
            columns={column}
            data={rows}
            pagination={{
              pageIndex: page - 1,
              pageSize: pageSize,
            }}
            totalCount={pagination?.total ?? 0}
            onPageChange={({ pageIndex, pageSize: newPageSize }) => {
              setPage(pageIndex + 1);
              setPageSize(newPageSize);
            }}
            renderToolbar={(table) => {
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

              return (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Input
                      placeholder={t("filters.search") || "Search invoices..."}
                      value={search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="h-8 w-[200px]"
                    />

                    <FilterChipMultiSelectPopover
                      label={t("status")}
                      values={statusFilter}
                      options={statusOptions}
                      onChange={(vals) => {
                        setStatusFilter(vals as InvoiceStatus[]);
                        setPage(1);
                      }}
                      searchPlaceholder={t("filters.search")}
                      resetLabel={t("filters.reset")}
                      doneLabel={t("filters.done")}
                      placeholder="All"
                    />
                    <DateRangePicker
                      label={t("invoiceDate")}
                      initialDateFrom={asDateValue(invoiceDateFrom)}
                      initialDateTo={asDateValue(invoiceDateTo)}
                      onUpdate={({ range }) => {
                        setInvoiceDateFrom(
                          range?.from ? toYmd(range.from) : "",
                        );
                        setInvoiceDateTo(range?.to ? toYmd(range.to) : "");
                        setPage(1);
                      }}
                      align="start"
                    />
                    <DateRangePicker
                      label={t("dueDate")}
                      initialDateFrom={asDateValue(dueDateFrom)}
                      initialDateTo={asDateValue(dueDateTo)}
                      onUpdate={({ range }) => {
                        setDueDateFrom(range?.from ? toYmd(range.from) : "");
                        setDueDateTo(range?.to ? toYmd(range.to) : "");
                        setPage(1);
                      }}
                      align="start"
                    />

                    <Button
                      variant="ghost-primary"
                      size="sm"
                      onClick={handleClearFilters}
                    >
                      {t("buttons.clearFilters")}
                    </Button>
                  </div>
                </div>
              );
            }}
          />
        </>
      )}
    </>
  );
}
