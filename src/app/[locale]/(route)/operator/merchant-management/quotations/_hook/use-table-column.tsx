import ActionsCell from "@/components/action-cell";
import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Quotation, QuotationStatus } from "@/lib/types";
import { useQuotationStore } from "@/store/quotation-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { getQuotationStatusBadgeVariant } from "./status";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";

export type QuotationRow = Quotation & {
  clientName: string;
  issueDateLabel: string;
};

export default function useQuotationTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Quotations");
  const router = useRouter();
  const deleteQuotation = useQuotationStore((s) => s.deleteQuotation);
  const { basePath } = useBasePath();

  const onOpenDetail = (item: QuotationRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: QuotationRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: QuotationRow) => {
    deleteQuotation(item.id);
    toast.success(t("messages.deleteSuccess"));
  };

  const column: ColumnDef<QuotationRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<QuotationRow>
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
      accessorKey: "quotationNumber",
      header: t("columns.number"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("quotationNumber") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "clientName",
      header: t("columns.client"),
      cell: ({ row }) => <div>{String(row.getValue("clientName") ?? "")}</div>,
    },
    {
      accessorKey: "amount",
      header: t("columns.amount"),
      cell: ({ row }) => {
        const value = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="font-medium">
              {`${getCurrencySymbol(value.currency)} ${formattedAmount(
                value.amount,
                value.currency,
              )}`}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "issueDateLabel",
      header: t("columns.quotationDate"),
      cell: ({ row }) => (
        <div>{String(row.getValue("issueDateLabel") ?? "")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const status = row.original.status || "draft";

        return (
          <Badge
            variant={getQuotationStatusBadgeVariant(status as QuotationStatus)}
          >
            {t(`statuses.${status}`)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
  ];

  return { column };
}
