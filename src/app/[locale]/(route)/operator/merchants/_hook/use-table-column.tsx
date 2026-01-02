import { useTranslations } from "next-intl";
import ActionsCell from "../../_components/action-cell";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { useMerchantStore } from "@/store/merchant-store";
import type { AppMerchant } from "@/types/merchant";

export type MerchantRow = AppMerchant;

export default function useMerchantTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Merchants");
  const router = useRouter();
  const pathname = usePathname();
  const { deleteMerchant } = useMerchantStore();

  const basePath = pathname.replace(/\/+$/, "");

  const onOpenDetail = (item: MerchantRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: MerchantRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: MerchantRow) => {
    deleteMerchant(item.id);
  };

  const column: ColumnDef<MerchantRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantRow>
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
      header: t("columns.merchantId"),
      cell: ({ row }) => (
        <Button
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
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "transactionCount",
      header: t("columns.transactionCount"),
      cell: ({ row }) => {
        const v = row.getValue("transactionCount");
        return <div>{typeof v === "number" ? v : Number(v ?? 0)}</div>;
      },
    },
  ];

  return { column };
}
