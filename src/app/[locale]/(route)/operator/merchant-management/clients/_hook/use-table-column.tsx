import { Button } from "@/components/ui/button";
import type { Client } from "@/lib/types";
import { useClientStore } from "@/store/client-store";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ActionsCell from "@/components/action-cell";

export type ClientRow = Client;

export default function useClientTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Clients");
  const router = useRouter();
  const deleteClient = useClientStore((s) => s.deleteClient);

  const pathname = usePathname();

  const basePath = pathname.replace(/\/+$/, "");

  const onOpenDetail = (item: ClientRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: ClientRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: ClientRow) => {
    deleteClient(item.id);
  };

  const column: ColumnDef<ClientRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<ClientRow>
          item={row.original}
          actions={[
            {
              title: t("actions.view"),
              onPress: (item) => onOpenDetail(item),
            },
            {
              title: t("actions.edit"),
              onPress: (item) => onOpenEdit(item),
            },
            {
              title: t("actions.delete"),
              variant: "destructive",
              onPress: (item) => onDelete(item),
            },
          ]}
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
      accessorKey: "contactPerson",
      header: t("columns.contactPerson"),
      cell: ({ row }) => (
        <div>{String(row.getValue("contactPerson") ?? "—")}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: t("columns.phoneNumber"),
      cell: ({ row }) => <div>{String(row.getValue("phoneNumber") ?? "")}</div>,
    },
    {
      accessorKey: "email",
      header: t("columns.email"),
      cell: ({ row }) => <div>{String(row.getValue("email") ?? "")}</div>,
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
  ];

  return { column };
}
