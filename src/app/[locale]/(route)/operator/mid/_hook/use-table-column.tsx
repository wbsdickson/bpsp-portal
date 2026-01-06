import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AppMid, MidStatus } from "@/types/mid";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import ActionsCell from "@/components/action-cell";
import { useBasePath } from "@/hooks/use-base-path";

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
  const { basePath } = useBasePath();

  const column: ColumnDef<MidRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MidRow>
          item={row.original}
          t={t}
          actions={[
            {
              title: t("actions.view"),
              onPress: (item) => router.push(`${basePath}/${item.id}`),
            },
            {
              title: t("actions.edit"),
              onPress: (item) => router.push(`${basePath}/edit/${item.id}`),
            },
          ]}
        />
      ),
    },
    {
      accessorKey: "mid",
      header: t("columns.mid"),
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("mid") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "brand",
      header: t("columns.brand"),
      cell: ({ row }) => <div>{String(row.getValue("brand") ?? "")}</div>,
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
        const variant: "default" | "secondary" =
          v === "active" ? "default" : "secondary";
        return <Badge variant={variant}>{label}</Badge>;
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
  ];

  return { column };
}
