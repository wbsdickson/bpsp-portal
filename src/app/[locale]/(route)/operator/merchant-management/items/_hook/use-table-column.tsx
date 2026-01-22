import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Item } from "@/lib/types";
import { useItemStore } from "@/store/item-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ActionsCell from "@/components/action-cell";
import { useBasePath } from "@/hooks/use-base-path";

export type ItemRow = Item & {
  taxCategoryLabel: string;
};

import { getStatusBadgeVariant } from "./status";

export default function useItemTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Items");
  const router = useRouter();
  const deleteItem = useItemStore((s) => s.deleteItem);

  const { basePath } = useBasePath();

  const onOpenDetail = (item: ItemRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: ItemRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: ItemRow) => {
    deleteItem(item.id);
    toast.success(t("messages.deleteSuccess"));
  };

  const column: ColumnDef<ItemRow>[] = [
    {
      accessorKey: "id",
      header: t("columns.id"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="hover:bg-secondary h-8 px-2 font-medium hover:underline"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("id") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: t("columns.name"),
      cell: ({ row }) => <div>{String(row.getValue("name") ?? "")}</div>,
    },
    {
      accessorKey: "unitPrice",
      header: t("columns.unitPrice"),
      cell: ({ row }) => {
        const v = row.getValue("unitPrice");
        const num = typeof v === "number" ? v : Number(v ?? 0);
        return <div>{num.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "taxCategoryLabel",
      header: t("columns.taxCategory"),
      cell: ({ row }) => (
        <div>{String(row.getValue("taxCategoryLabel") ?? "")}</div>
      ),
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
    {
      accessorKey: "description",
      header: t("columns.description"),
      cell: ({ row }) => {
        const v = row.getValue("description");
        const s = typeof v === "string" ? v : "";
        if (!s.trim()) return <div className="text-muted-foreground">—</div>;
        return <div>{s}</div>;
      },
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const status = row.original.status || "active";

        return (
          <Badge variant={getStatusBadgeVariant(status)}>
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
    {
      id: "actions",
      header: t("columns.actions"),
      size: 100,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<ItemRow>
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
