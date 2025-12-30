import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import type { AppMerchantMid } from "@/types/merchant-mid";
import ActionsCell from "@/app/[locale]/(route)/operator/_components/action-cell";
import { useRouter } from "next/navigation";
import { useMerchantMidStore } from "@/store/merchant-mid-store";

type MerchantMidRow = AppMerchantMid & { merchantName: string };

export default function useMerchantMidTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.MerchantMIDs");

  const { deleteMid } = useMerchantMidStore();
  const router = useRouter();

  const onOpenDetail = (item: MerchantMidRow) => {
    router.push(`/operator/merchant-mid/${item.id}`);
  };
  const onOpenEdit = (item: MerchantMidRow) => {
    router.push(`/operator/merchant-mid/edit/${item.id}`);
  };
  const onDelete = (item: MerchantMidRow) => {
    deleteMid(item.id);
  };

  const column: ColumnDef<MerchantMidRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantMidRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
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
      cell: ({ row }) => (
        <div className="capitalize">{String(row.getValue("status") ?? "")}</div>
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
