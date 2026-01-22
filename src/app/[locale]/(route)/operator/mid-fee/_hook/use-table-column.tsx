import { Badge } from "@/components/ui/badge";
import { getMidFeeStatusBadgeVariant } from "./status";
import { type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AppMidFee, MidFeeStatus } from "@/types/mid-fee";
import { useMidFeeStore } from "@/store/mid-fee-store";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import ActionsCell from "@/components/action-cell";
import { useBasePath } from "@/hooks/use-base-path";
import { getCardBrandIcon } from "@/lib/utils";

export type MidFeeRow = AppMidFee & {
  midLabel: string;
  brand: string;
};

export default function useMidFeeTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.MIDFee");
  const router = useRouter();
  const { deleteFee } = useMidFeeStore();
  const { basePath } = useBasePath();

  const onOpenDetail = (item: MidFeeRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onDelete = (item: MidFeeRow) => {
    deleteFee(item.id);
    toast.success(t("messages.deleteSuccess"));
  };

  const column: ColumnDef<MidFeeRow>[] = [
    {
      accessorKey: "midLabel",
      header: t("columns.mid"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="hover:bg-secondary h-8 px-2 font-medium hover:underline"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("midLabel") ?? "")}
        </Button>
      ),
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (!value) return true;
        return cellValue.toLowerCase().includes(String(value).toLowerCase());
      },
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
      accessorKey: "mdrPercent",
      header: t("columns.mdr"),
      cell: ({ row }) => {
        const v = row.getValue("mdrPercent");
        const num = typeof v === "number" ? v : Number(v ?? 0);
        return <div>{num.toFixed(2)}%</div>;
      },
    },
    {
      accessorKey: "fixedFeeAmount",
      header: t("columns.fixedFeeAmount"),
      cell: ({ row }) => {
        const v = row.getValue("fixedFeeAmount");
        const num = typeof v === "number" ? v : Number(v ?? 0);
        return <div>{num.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const v = String(row.getValue("status") ?? "") as MidFeeStatus;
        const label = t(`statuses.${v}`);

        return <Badge variant={getMidFeeStatusBadgeVariant(v)}>{label}</Badge>;
      },
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        if (!value) return true;
        return cellValue === String(value);
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
        <ActionsCell<MidFeeRow>
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
