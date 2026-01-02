import { useTranslations } from "next-intl";
import ActionsCell from "../../_components/action-cell";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { useAccountStore } from "@/store/account-store";
import { type AppUser } from "@/types/user";

export type UserRow = AppUser;

export default function useAccounTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Accounts");
  const router = useRouter();
  const pathname = usePathname();
  const { deleteAccount } = useAccountStore();

  const basePath = pathname.replace(/\/+$/, "");

  const onOpenDetail = (item: UserRow) => {
    router.push(`${basePath}/${item.id}`);
  };
  const onOpenEdit = (item: UserRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };
  const onDelete = (item: UserRow) => {
    deleteAccount(item.id);
  };

  const column: ColumnDef<UserRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<UserRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
          t={t}
        />
      ),
    },
    {
      accessorKey: "name",
      header: t("columns.name"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("name") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: t("columns.email"),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: t("columns.role"),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const rowValue = row.getValue(columnId);

        if (Array.isArray(filterValue)) {
          if (filterValue.length === 0) return true;
          return filterValue.includes(String(rowValue));
        }

        return String(rowValue) === String(filterValue);
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "lastLoginAt",
      header: t("columns.lastLoginAt"),
      cell: ({ row }) => {
        const raw = row.getValue("lastLoginAt");
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
