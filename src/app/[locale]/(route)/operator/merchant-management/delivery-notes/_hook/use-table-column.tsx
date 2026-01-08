import ActionsCell from "@/components/action-cell";
import { Button } from "@/components/ui/button";
import type { DeliveryNote } from "@/lib/types";
import { useDeliveryNoteStore } from "@/store/delivery-note-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";

export type DeliveryNoteRow = DeliveryNote & {
  clientName: string;
  issueDateLabel: string;
};

export default function useDeliveryNoteTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.DeliveryNotes");
  const router = useRouter();
  const { basePath } = useBasePath();
  const deleteDeliveryNote = useDeliveryNoteStore((s) => s.deleteDeliveryNote);

  const onOpenDetail = (item: DeliveryNoteRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: DeliveryNoteRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: DeliveryNoteRow) => {
    deleteDeliveryNote(item.id);
  };

  const column: ColumnDef<DeliveryNoteRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<DeliveryNoteRow>
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
              onPress: (item) => onDelete(item),
            },
          ]}
          t={t}
        />
      ),
    },
    {
      accessorKey: "deliveryNoteNumber",
      header: t("columns.number"),
      cell: ({ row }) => (
        <Button
          
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("deliveryNoteNumber") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "clientName",
      header: t("columns.client"),
      cell: ({ row }) => <div>{String(row.getValue("clientName") ?? "")}</div>,
    },
    {
      accessorKey: "amount",
      header: t("columns.amount"),
      cell: ({ row }) => {
        const v = row.getValue("amount");
        const num = typeof v === "number" ? v : Number(v ?? 0);
        return <div>{num.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "issueDateLabel",
      header: t("columns.issueDate"),
      cell: ({ row }) => (
        <div>{String(row.getValue("issueDateLabel") ?? "")}</div>
      ),
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
