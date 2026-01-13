import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import type { AppMerchantMid, MerchantMidStatus } from "@/types/merchant-mid";
import { usePathname, useRouter } from "next/navigation";
import { useMerchantMidStore } from "@/store/merchant-mid-store";
import { useBasePath } from "@/hooks/use-base-path";
import ActionsCell from "@/components/action-cell";
import { getStatusBadgeVariant } from "./status";
import { getCardBrandIcon } from "@/lib/utils";

export type MerchantMidRow = AppMerchantMid & {
  merchantName: string;
  cardBrand: string;
};

export default function useMerchantMidTableColumn({
  addTab,
}: {
  addTab: (item: MerchantMidRow) => void;
}) {
  const t = useTranslations("Operator.MerchantMIDs");

  const { deleteMid } = useMerchantMidStore();
  const router = useRouter();
  const { basePath } = useBasePath();

  const onOpenDetail = (item: MerchantMidRow) => {
    router.push(`${basePath}/${item.id}`);
  };
  const onOpenEdit = (item: MerchantMidRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };
  const onDelete = (item: MerchantMidRow) => {
    deleteMid(item.id);
    toast.success(t("messages.deleteSuccess"));
  };

  const column: ColumnDef<MerchantMidRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantMidRow>
          item={row.original}
          actions={[
            {
              title: t("actions.view"),
              onPress: () => onOpenDetail(row.original),
            },
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
      accessorKey: "merchantName",
      header: t("columns.merchantName"),
      cell: ({ row }) => (
        <div>{String(row.getValue("merchantName") ?? "")}</div>
      ),
    },
    {
      accessorKey: "mid",
      header: t("columns.mid"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original)}
        >
          {String(row.getValue("mid") ?? "")}
        </Button>
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

        const variant = getStatusBadgeVariant(status);
        return <Badge variant={variant}>{t(`statuses.${status}`)}</Badge>;
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
