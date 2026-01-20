import { useTranslations } from "next-intl";
import ActionsCell from "@/components/action-cell";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useMerchantStore } from "@/store/merchant-store";
import type { AppMerchant } from "@/types/merchant";
import { useBasePath } from "@/hooks/use-base-path";

export type MerchantRow = AppMerchant;

export default function useMerchantTableColumn({
  addTab,
  refetch,
}: {
  addTab: (id: string) => void;
  refetch?: () => Promise<void>;
}) {
  const t = useTranslations("Operator.Merchants");
  const router = useRouter();
  const { deleteMerchant } = useMerchantStore();
  const { basePath } = useBasePath();

  const onDelete = async (item: MerchantRow) => {
    deleteMerchant(item.id);
    toast.success(t("messages.deleteSuccess"));
    // Refetch data from API if refetch function is provided
    if (refetch) {
      await refetch();
    }
  };

  const column: ColumnDef<MerchantRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantRow>
          item={row.original}
          t={t}
          actions={[
            {
              title: t("actions.view"),
              onPress: (item) => router.push(`${basePath}/${item.id}`),
            },
            {
              title: t("actions.delete"),
              variant: "destructive",
              onPress: (item) => onDelete(item),
              confirmation: {
                title: t("dialog.deleteTitle"),
                description: t("dialog.deleteDescription"),
              },
            },
          ]}
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
