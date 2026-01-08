import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import type { AppMerchantFee } from "@/types/merchant-fee";
import { usePathname, useRouter } from "next/navigation";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useBasePath } from "@/hooks/use-base-path";
import ActionsCell from "@/components/action-cell";

export type MerchantFeeRow = AppMerchantFee & { merchantName: string };

export default function useMerchantFeeTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.MerchantFees");
  const { deleteFee } = useMerchantFeeStore();

  const router = useRouter();

  const { basePath } = useBasePath();

  const onOpenDetail = (item: MerchantFeeRow) => {
    router.push(`${basePath}/${item.id}`);
  };
  const onOpenEdit = (item: MerchantFeeRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: MerchantFeeRow) => {
    deleteFee(item.id);
  };

  const column: ColumnDef<MerchantFeeRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantFeeRow>
          item={row.original}
          actions={[
            {
              title: t("actions.view"),
              onPress: () => onOpenDetail(row.original),
            },
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
      accessorKey: "merchantName",
      header: t("columns.merchantName"),
      cell: ({ row }) => (
        <Button
          
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("merchantName") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "brand",
      header: t("columns.brand"),
      cell: ({ row }) => <div>{String(row.getValue("brand") ?? "")}</div>,
    },
    {
      accessorKey: "paymentMethodType",
      header: t("columns.paymentMethodType"),
      cell: ({ row }) => {
        const v = String(row.getValue("paymentMethodType") ?? "");
        return <div>{v ? t(`paymentMethodTypes.${v}`) : "—"}</div>;
      },
    },
    {
      accessorKey: "mdrPercent",
      header: t("columns.mdrPercent"),
      cell: ({ row }) => {
        const v = row.getValue("mdrPercent");
        const num = typeof v === "number" ? v : Number(v ?? 0);
        return <div>{num.toFixed(2)}%</div>;
      },
    },
    {
      accessorKey: "fixedFee",
      header: t("columns.fixedFee"),
      cell: ({ row }) => {
        const v = row.getValue("fixedFee");
        const num = typeof v === "number" ? v : Number(v ?? 0);
        return <div>{num.toFixed(2)}</div>;
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
      accessorKey: "updatedAt",
      header: t("columns.lastUpdatedDate"),
      cell: ({ row }) => {
        const raw = row.getValue("updatedAt");
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
