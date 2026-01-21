import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import type { User } from "@/lib/types";
import ActionsCell from "../../_components/action-cell";
import { useMerchantMemberStore } from "@/store/merchant/merchant-member-store";
import { Badge } from "@/components/ui/badge";

export type MerchantMemberRow = User;

export default function useMerchantMemberTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.MerchantMembers");
  const router = useRouter();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  const { deleteMember } = useMerchantMemberStore();

  const onOpenDetail = (item: MerchantMemberRow) => {
    router.push(`/merchant/members/${item.id}`);
  };

  const onOpenEdit = (item: MerchantMemberRow) => {
    router.push(`/merchant/members/edit/${item.id}`);
  };

  const onDelete = (item: MerchantMemberRow) => {
    deleteMember(item.id);
  };

  const column: ColumnDef<MerchantMemberRow>[] = [
    {
      accessorKey: "id",
      header: t("columns.id"),
      size: 80,
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
      size: 150,
      cell: ({ row }) => (
        <div className="font-normal">{String(row.getValue("name") ?? "")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: t("columns.email"),
      size: 150,
      cell: ({ row }) => <div>{String(row.getValue("email") ?? "")}</div>,
    },
    {
      id: "role",
      accessorKey: "memberRole",
      header: t("columns.role"),
      size: 120,
      cell: ({ row }) => {
        const role = row.original.memberRole ?? row.original.role;
        const roleStr = String(role ?? "").toLowerCase();

        if (!roleStr) return <div className="text-muted-foreground">—</div>;

        return (
          <Badge variant="outline-primary" className="capitalize">
            {t(`memberRoles.${roleStr}`)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      size: 120,
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
          <div>
            {raw === "active" && (
              <Badge variant="outline-success" className="capitalize">
                {t(`statuses.${raw}`)}
              </Badge>
            )}
            {raw === "suspended" && (
              <Badge variant="outline-destructive" className="capitalize">
                {t(`statuses.${raw}`)}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "lastLoginAt",
      header: t("columns.lastLoginAt"),
      size: 150,
      cell: ({ row }) => {
        const raw = row.getValue("lastLoginAt");
        const value = typeof raw === "string" ? raw : "";
        if (!value) return <div className="text-muted-foreground">—</div>;
        const dt = new Date(value);
        const label = Number.isNaN(dt.getTime()) ? value : dt.toLocaleString();
        return <div className="font-normal">{label}</div>;
      },
    },
    {
      id: "actions",
      header: t("columns.actions"),
      size: 100,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantMemberRow>
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
