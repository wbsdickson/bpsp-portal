import { Badge } from "@/components/ui/badge";
import { getMidSettingStatusBadgeVariant } from "./status";
import { type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AppMid, MidStatus } from "@/types/mid";
import { useMidStore } from "@/store/mid-store";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import ActionsCell from "@/components/action-cell";
import { useBasePath } from "@/hooks/use-base-path";
import { getCardBrandIcon } from "@/lib/utils";

export type MidRow = AppMid & {
  linkedMerchantsCount: number;
  linkedMerchantNamesLabel: string;
};

export default function useMidTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.MID");
  const router = useRouter();
  const { deleteMid } = useMidStore();
  const { basePath } = useBasePath();

  const onDelete = (item: MidRow) => {
    deleteMid(item.id);
    toast.success(t("messages.deleteSuccess"));
  };
  const onOpenDetail = (item: MidRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const column: ColumnDef<MidRow>[] = [
    {
      accessorKey: "mid",
      header: t("columns.mid"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="hover:bg-secondary h-8 px-2 font-medium hover:underline"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("mid") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "brand",
      header: t("columns.brand"),
      cell: ({ row }) => {
        const brand = String(row.getValue("brand") ?? "");
        return <div>{getCardBrandIcon(brand)}</div>;
      },
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (!value) return true;
        return cellValue.toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const v = String(row.getValue("status") ?? "") as MidStatus;
        const label = t(`statuses.${v}`);

        return (
          <Badge variant={getMidSettingStatusBadgeVariant(v)}>{label}</Badge>
        );
      },
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        if (!value) return true;
        return cellValue === String(value);
      },
    },
    {
      accessorKey: "linkedMerchantsCount",
      header: t("columns.linkedMerchantsCount"),
      cell: ({ row }) => (
        <div className="text-right">{row.original.linkedMerchantsCount}</div>
      ),
    },
    {
      accessorKey: "linkedMerchantNamesLabel",
      header: t("columns.linkedMerchants"),
      cell: ({ row }) => (
        <div>{String(row.getValue("linkedMerchantNamesLabel") ?? "")}</div>
      ),
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (!value) return true;
        return cellValue.toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      accessorKey: "createdAt",
      header: t("columns.createdAt"),
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
      id: "actions",
      header: t("columns.actions"),
      size: 100,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MidRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          onDelete={onDelete}
          t={t}
          variant="verbose"
        />
      ),
    },
  ];

  return { column };
}
