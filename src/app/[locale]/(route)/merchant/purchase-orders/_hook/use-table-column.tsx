import { Button } from "@/components/ui/button";
import type { PurchaseOrder, Quotation } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { usePurchaseOrderStore } from "@/store/merchant/purchase-order-store";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "../../_components/action-cell";

export type PurchaseOrderRow = PurchaseOrder & {
  clientName: string;
  issueDateLabel: string;
};

export default function useQuotationTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.PurchaseOrders");
  const router = useRouter();
  const deletePurchaseOrder = usePurchaseOrderStore(
    (s) => s.deletePurchaseOrder,
  );
  const { basePath } = useBasePath();

  const onOpenDetail = (item: PurchaseOrderRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: PurchaseOrderRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: PurchaseOrderRow) => {
    deletePurchaseOrder(item.id);
  };

  const column: ColumnDef<PurchaseOrderRow>[] = [
    {
      accessorKey: "poNumber",
      header: t("columns.purchaseOrderNumber"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("poNumber") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "poDate",
      header: t("columns.purchaseOrderDate"),
      cell: ({ row }) => <div>{String(row.getValue("poDate") ?? "")}</div>,
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
          {row.getValue("status") === "draft" && (
            <Badge variant="outline-info">{t("statuses.draft")}</Badge>
          )}
          {row.getValue("status") === "sent" && (
            <Badge variant="outline-warning">{t("statuses.sent")}</Badge>
          )}
          {row.getValue("status") === "accepted" && (
            <Badge variant="outline-success">{t("statuses.accepted")}</Badge>
          )}
          {row.getValue("status") === "rejected" && (
            <Badge variant="outline-destructive">
              {t("statuses.rejected")}
            </Badge>
          )}
          {row.getValue("status") === "expired" && (
            <Badge variant="outline-warning">{t("statuses.expired")}</Badge>
          )}
        </div>
      ),
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
    {
      id: "actions",
      header: t("columns.actions"),
      size: 100,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<PurchaseOrderRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
          variant="verbose"
          t={t}
        />
      ),
    },
  ];

  return { column };
}
