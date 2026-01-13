import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import ActionsCell from "@/components/action-cell";
import { toast } from "sonner";
import {
  useMerchantCardStore,
  type MerchantCardStatus,
} from "@/store/merchant-card-store";
import type { AppMerchantCard } from "@/store/merchant-card-store";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { getCardBrandIcon } from "@/lib/utils";

export type MerchantCardRow = AppMerchantCard & {
  status: MerchantCardStatus;
  expirationLabel: string;
};

export default function useMerchantCardTableColumn() {
  const t = useTranslations("Operator.MerchantCards");
  const deleteCard = useMerchantCardStore((s) => s.deleteCard);

  const onDelete = (item: MerchantCardRow) => {
    deleteCard(item.id);
    toast.success(t("messages.deleteSuccess"));
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
              variant: "destructive",
              onPress: () => onDelete(row.original),
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
      accessorKey: "cardBrand",
      header: t("columns.brand"),
      cell: ({ row }) => {
        const brand = String(row.getValue("cardBrand") ?? "");
        return <div>{getCardBrandIcon(brand)}</div>;
      },
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
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const status = row.original.status;

        const variantMap: Record<MerchantCardStatus, BadgeVariant> = {
          used: "success",
          unused: "secondary",
        };

        return (
          <Badge variant={variantMap[status]}>
            {t(`statuses.${status}`)}
          </Badge>
        );
      },
    },
  ];

  return { column };
}
