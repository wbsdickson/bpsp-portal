import ActionsCell from "@/components/action-cell";
import { useMerchantCardStore } from "@/store/merchant-card-store";
import type { AppMerchantCard } from "@/store/merchant-card-store";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export type MerchantCardRow = AppMerchantCard & {
  statusLabel: string;
  expirationLabel: string;
};

export default function useMerchantCardTableColumn() {
  const t = useTranslations("Operator.MerchantCards");
  const deleteCard = useMerchantCardStore((s) => s.deleteCard);

  const onDelete = (item: MerchantCardRow) => {
    deleteCard(item.id);
  };

  const column: ColumnDef<MerchantCardRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantCardRow>
          item={row.original}
          actions={[
            {
              title: t("actions.delete"),
              onPress: () => onDelete(row.original),
            },
          ]}
          t={t}
        />
      ),
    },
    {
      accessorKey: "cardBrand",
      header: t("columns.brand"),
      cell: ({ row }) => <div>{String(row.getValue("cardBrand") ?? "")}</div>,
    },
    {
      accessorKey: "merchantName",
      header: t("columns.merchant"),
      cell: ({ row }) => (
        <div>{String(row.getValue("merchantName") ?? "")}</div>
      ),
    },
    {
      accessorKey: "last4",
      header: t("columns.last4"),
      cell: ({ row }) => <div>{String(row.getValue("last4") ?? "")}</div>,
    },
    {
      accessorKey: "expirationLabel",
      header: t("columns.expirationDate"),
      cell: ({ row }) => (
        <div>{String(row.getValue("expirationLabel") ?? "")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("columns.registrationDate"),
      cell: ({ row }) => {
        const raw = row.getValue("createdAt");
        const value = typeof raw === "string" ? raw : "";
        if (!value) return <div className="text-muted-foreground">—</div>;
        const dt = new Date(value);
        const label = Number.isNaN(dt.getTime()) ? value : dt.toLocaleString();
        return <div>{label}</div>;
      },
    },
    {
      accessorKey: "statusLabel",
      header: t("columns.status"),
      cell: ({ row }) => <div>{String(row.getValue("statusLabel") ?? "")}</div>,
    },
  ];

  return { column };
}
