import ActionsCell from "@/components/action-cell";
import { Button } from "@/components/ui/button";
import type { PurchaseOrder, Quotation } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { usePurchaseOrderStore } from "@/store/merchant/purchase-order-store";
import { Badge } from "@/components/ui/badge";

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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<PurchaseOrderRow>
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
            <Badge
              variant="secondary"
              className="bg-indigo-50 capitalize text-indigo-700"
            >
              {t("statuses.draft")}
            </Badge>
          )}
          {row.getValue("status") === "sent" && (
            <Badge
              variant="secondary"
              className="bg-amber-50 capitalize text-amber-700"
            >
              {t("statuses.sent")}
            </Badge>
          )}
          {row.getValue("status") === "accepted" && (
            <Badge
              variant="secondary"
              className="bg-amber-50 capitalize text-amber-700"
            >
              {t("statuses.accepted")}
            </Badge>
          )}
          {row.getValue("status") === "rejected" && (
            <Badge
              variant="secondary"
              className="bg-red-50 capitalize text-red-700"
            >
              {t("statuses.rejected")}
            </Badge>
          )}
          {row.getValue("status") === "expired" && (
            <Badge
              variant="secondary"
              className="bg-amber-50 capitalize text-amber-700"
            >
              {t("statuses.expired")}
            </Badge>
          )}
        </div>
      ),
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
  ];

  return { column };
}
