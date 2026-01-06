import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import type { User } from "@/lib/types";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import { useMerchantStore } from "@/store/merchant-store";
import ActionsCell from "@/components/action-cell";

export type MerchantMemberRow = User;

export default function useMerchantMemberTableColumn({
  addTab,
}: {
  addTab: (item: MerchantMemberRow) => void;
}) {
  const t = useTranslations("Operator.MerchantMembers");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  const { deleteMember } = useMerchantMemberStore();
  const getMerchantById = useMerchantStore((s) => s.getMerchantById);

  const basePath = pathname.replace(/\/+$/, "");

  const onOpenDetail = (item: MerchantMemberRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: MerchantMemberRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: MerchantMemberRow) => {
    deleteMember(item.id);
  };

  const column: ColumnDef<MerchantMemberRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantMemberRow>
          item={row.original}
          actions={[
            {
              title: t("actions.view"),
              onPress: onOpenDetail,
            },
            {
              title: t("actions.delete"),
              onPress: onDelete,
            },
          ]}
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
          onClick={() => addTab(row.original)}
        >
          {String(row.getValue("id") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "merchantId",
      header: "Merchant",
      cell: ({ row }) => {
        const value = row.getValue("merchantId");
        if (!value) return <div className="text-muted-foreground">—</div>;

        const id = String(value);
        const merchant = getMerchantById(id);
        return <>{merchant?.name ?? id}</>;
      },
      enableHiding: Boolean(merchantId),
    },
    {
      accessorKey: "name",
      header: t("columns.name"),
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original)}
        >
          {String(row.getValue("name") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: t("columns.email"),
      cell: ({ row }) => <div>{String(row.getValue("email") ?? "")}</div>,
    },
    {
      id: "role",
      header: t("columns.role"),
      cell: ({ row }) => {
        const role = row.original.memberRole;
        return <div className="capitalize">{String(role ?? "—")}</div>;
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
        return <div className="capitalize">{String(raw ?? "—")}</div>;
      },
    },
  ];

  return { column };
}
