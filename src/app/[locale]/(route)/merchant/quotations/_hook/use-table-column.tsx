import ActionsCell from "@/components/action-cell";
import { Button } from "@/components/ui/button";
import type { Quotation } from "@/lib/types";
import { useQuotationStore } from "@/store/merchant/quotation-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { Badge } from "@/components/ui/badge";

export type QuotationRow = Quotation & {
  clientName: string;
  issueDateLabel: string;
};

export default function useQuotationTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.Quotations");
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
            },
          ]}
          t={t}
        />
      ),
    },
    {
      accessorKey: "quotationNumber",
      header: t("columns.quotationNumber"),
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
      accessorKey: "issueDateLabel",
      header: t("columns.quotationDate"),
      cell: ({ row }) => (
        <div>{String(row.getValue("issueDateLabel") ?? "")}</div>
      ),
    },
    {
      accessorKey: "clientName",
      header: t("columns.clientName"),
      cell: ({ row }) => <div>{String(row.getValue("clientName") ?? "")}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: t("columns.totalAmount"),
      cell: ({ row }) => {
        const v = row.getValue("amount");
        const num = typeof v === "number" ? v : Number(v ?? 0);
        return <div>{num.toLocaleString()}</div>;
      },
    },

    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.status === "draft" && (
            <Badge variant="info">{t("statuses.draft")}</Badge>
          )}
          {row.original.status === "sent" && (
            <Badge variant="warning">{t("statuses.sent")}</Badge>
          )}
          {row.original.status === "accepted" && (
            <Badge variant="success">{t("statuses.accepted")}</Badge>
          )}
          {row.original.status === "rejected" && (
            <Badge variant="destructive">{t("statuses.rejected")}</Badge>
          )}
          {row.original.status === "expired" && (
            <Badge variant="warning">{t("statuses.expired")}</Badge>
          )}
        </div>
      ),
    },
  ];

  return { column };
}
