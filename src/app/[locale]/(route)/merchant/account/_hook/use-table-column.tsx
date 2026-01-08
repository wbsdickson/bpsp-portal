import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import type { User } from "@/lib/types";
import ActionsCell from "../../_components/action-cell";
import { useMerchantAccountStore } from "@/store/merchant/merchant-account-store";
import { Badge } from "@/components/ui/badge";

export type MerchantAccountRow = User;

export default function useMerchantAccountTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.AccountInformationManagement");
  const router = useRouter();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  const deleteAccount = useMerchantAccountStore((s) => s.deleteAccount);

  const onOpenDetail = (item: MerchantAccountRow) => {
    router.push(`/merchant/account/${item.id}`);
  };

  const onOpenEdit = (item: MerchantAccountRow) => {
    router.push(`/merchant/account/edit/${item.id}`);
  };

  const onDelete = (item: MerchantAccountRow) => {
    deleteAccount(item.id);
  };

  const column: ColumnDef<MerchantAccountRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantAccountRow>
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
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(String(row.getValue("id") ?? ""))}
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
      accessorKey: "email",
      header: t("columns.email"),
      cell: ({ row }) => <div>{String(row.getValue("email") ?? "")}</div>,
    },
    {
      id: "role",
      accessorKey: "role",
      header: t("columns.role"),
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            {String(row.getValue("role") ?? "—")}
          </div>
        );
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
      accessorKey: "status",
      header: t("columns.status"),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const rowValue = row.getValue(columnId);

        if (Array.isArray(filterValue)) {
          if (filterValue.length === 0) return true;
          return filterValue.includes(String(rowValue));
        }

        return String(rowValue) === String(filterValue);
      },
      cell: ({ row }) => {
        const raw = row.getValue("status");
        return (
          <div className="capitalize">
            {raw === "active" && (
              <Badge variant="success">{t(`statuses.${raw}`)}</Badge>
            )}
            {raw === "suspended" && (
              <Badge variant="destructive">{t(`statuses.${raw}`)}</Badge>
            )}
          </div>
        );
      },
    },
  ];

  return { column };
}
