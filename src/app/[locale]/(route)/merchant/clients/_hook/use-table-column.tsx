import ActionsCell from "../../_components/action-cell";
import { Button } from "@/components/ui/button";
import type { Client } from "@/lib/types";
import { useMerchantClientStore } from "@/store/merchant/merchant-client-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export type ClientRow = Client & { contactPerson: string };

export default function useClientTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.Clients");
  const router = useRouter();
  const deleteClient = useMerchantClientStore((s) => s.deleteClient);

  const onOpenDetail = (item: ClientRow) => {
    router.push(`/merchant/clients/${item.id}`);
  };

  const onOpenEdit = (item: ClientRow) => {
    router.push(`/merchant/clients/edit/${item.id}`);
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
