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
import { useReceiptStore } from "@/store/merchant/receipt-store";
import { useBasePath } from "@/hooks/use-base-path";
import { toYmd } from "@/lib/date-utils";
import DateRangePicker from "@/components/date-range-picker";
import { asDateValue } from "@/lib/date-utils";
import ActionsCell from "../../_components/action-cell";

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
  const t = useTranslations("Merchant.Receipt");
  const { basePath } = useBasePath();

  const clients = useAppStore((s) => s.clients);
  const receipts = useReceiptStore((s) => s.receipts);
  const deleteReceipt = useReceiptStore((s) => s.deleteReceipt);

  const [issueDateFrom, setIssueDateFrom] = React.useState<string>("");
  const [issueDateTo, setIssueDateTo] = React.useState<string>("");
  const issueDateFromValue = asDateValue(issueDateFrom);
  const issueDateToValue = asDateValue(issueDateTo);

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
        accessorKey: "receiptNumber",
        header: t("columns.receiptNumber"),
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="hover:bg-secondary h-8 px-2 font-medium hover:underline"
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
        id: "actions",
        header: t("columns.actions"),
        size: 100,
        enableHiding: false,
        cell: ({ row }) => (
          <ActionsCell<ReceiptRow>
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
    [addTab, deleteReceipt, locale, router, t],
  );

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={columns}
        data={rows}
        renderToolbar={(table) => {
          const clientNameCol = table.getColumn("clientName");

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.client")}
                  value={String(clientNameCol?.getFilterValue() ?? "")}
                  onChange={(v) => clientNameCol?.setFilterValue(v)}
                />
                <DateRangePicker
                  label={t("filters.issueDate")}
                  initialDateFrom={asDateValue(
                    issueDateFromValue ? toYmd(issueDateFromValue) : "",
                  )}
                  initialDateTo={asDateValue(
                    issueDateToValue ? toYmd(issueDateToValue) : "",
                  )}
                  onUpdate={({ range }) => {
                    setIssueDateFrom(range?.from ? toYmd(range.from) : "");
                    setIssueDateTo(range?.to ? toYmd(range.to) : "");
                  }}
                  align="start"
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
