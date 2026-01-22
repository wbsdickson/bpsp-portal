import { Button } from "@/components/ui/button";
import type { Quotation } from "@/lib/types";
import { useQuotationStore } from "@/store/merchant/quotation-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "../../_components/action-cell";

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
            <Badge variant="outline-info">{t("statuses.draft")}</Badge>
          )}
          {row.original.status === "sent" && (
            <Badge variant="outline-warning">{t("statuses.sent")}</Badge>
          )}
          {row.original.status === "accepted" && (
            <Badge variant="outline-success">{t("statuses.accepted")}</Badge>
          )}
          {row.original.status === "rejected" && (
            <Badge variant="outline-destructive">
              {t("statuses.rejected")}
            </Badge>
          )}
          {row.original.status === "expired" && (
            <Badge variant="outline-warning">{t("statuses.expired")}</Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: t("columns.actions"),
      size: 100,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<QuotationRow>
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
