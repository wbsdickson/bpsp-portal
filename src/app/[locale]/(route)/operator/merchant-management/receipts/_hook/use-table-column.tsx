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

import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useReceivedInvoiceStore } from "@/store/received-invoice-store";
import { ReceiptRow } from "../_components/receipt-table";
import { getReceiptStatusBadgeVariant } from "./status";

export default function useReceiptTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Receipt");
  const router = useRouter();
  const deleteInvoice = useReceivedInvoiceStore((s) => s.deleteInvoice);

  const { basePath } = useBasePath();

  const onOpenDetail = (item: ReceiptRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: ReceiptRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: ReceiptRow) => {
    deleteInvoice(item.id);
    toast.success(t("messages.deleteSuccess"));
  };

  const column: ColumnDef<ReceiptRow>[] = [
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
      cell: ({ row }) => <div>{String(row.getValue("clientName") ?? "")}</div>,
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
        const status = row.original.status;

        return (
          <Badge variant={getReceiptStatusBadgeVariant(status)}>
            {t(`statuses.${status}`)}
          </Badge>
        );
      },
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
  ];

  return { column };
}
