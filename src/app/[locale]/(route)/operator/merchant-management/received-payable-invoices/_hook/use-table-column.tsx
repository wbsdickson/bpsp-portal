import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { InvoiceStatus, Item } from "@/lib/types";
import { useItemStore } from "@/store/item-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ActionsCell from "@/components/action-cell";
import { useBasePath } from "@/hooks/use-base-path";

export type ItemRow = Item & {
  taxCategoryLabel: string;
};

import { PayableInvoiceRow } from "../_components/received-payable-invoice-table";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { getStatusBadgeVariant } from "./status";
import { useReceivedInvoiceStore } from "@/store/received-invoice-store";

export default function useReceivedPayableInvoiceTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.ReceivedPayableInvoices");
  const router = useRouter();
  const deleteInvoice = useReceivedInvoiceStore((s) => s.deleteInvoice);

  const { basePath } = useBasePath();

  const onOpenDetail = (item: PayableInvoiceRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: PayableInvoiceRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: PayableInvoiceRow) => {
    deleteInvoice(item.id);
    toast.success(t("messages.deleteSuccess"));
  };

  const column: ColumnDef<PayableInvoiceRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<PayableInvoiceRow>
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
              confirmation: {
                title: t("dialog.deleteTitle"),
                description: t("dialog.deleteDescription"),
              },
            },
          ]}
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
      cell: ({ row }) => <div>{String(row.getValue("clientName") ?? "")}</div>,
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
      cell: ({ row }) => {
        const status = String(row.getValue("status") ?? "") as InvoiceStatus;
        const label = t(`statuses.${status}`);

        const variant = getStatusBadgeVariant(status);

        return <Badge variant={variant}>{label}</Badge>;
      },
    },
  ];

  return { column };
}
