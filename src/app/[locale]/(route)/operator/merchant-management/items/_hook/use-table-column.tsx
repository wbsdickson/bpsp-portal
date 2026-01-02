import { Button } from "@/components/ui/button";
import type { Item } from "@/lib/types";
import { useItemStore } from "@/store/item-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ActionsCell from "../../_components/action-cell";
import { useBasePath } from "@/hooks/use-base-path";

export type ItemRow = Item & {
  taxCategoryLabel: string;
  statusLabel: string;
};

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
  };

  const column: ColumnDef<ItemRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<ItemRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
          t={t}
        />
      ),
    },
    {
      accessorKey: "id",
      header: t("columns.id"),
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 font-medium"
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
      accessorKey: "statusLabel",
      header: t("columns.status"),
      cell: ({ row }) => <div>{String(row.getValue("statusLabel") ?? "")}</div>,
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
  ];

  return { column };
}
