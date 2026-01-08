import ActionsCell from "@/components/action-cell";
import { Button } from "@/components/ui/button";
import type { DeliveryNote } from "@/lib/types";
import { useDeliveryNoteStore } from "@/store/merchant/delivery-note-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { Badge } from "@/components/ui/badge";

export type DeliveryNoteRow = DeliveryNote & {
  clientName: string;
  issueDateLabel: string;
};

export default function useDeliveryNoteTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.DeliveryNotes");
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
              variant: "destructive",
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
          type="button"
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("deliveryNoteNumber") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "deliveryDate",
      header: t("columns.deliveryDate"),
      cell: ({ row }) => (
        <div>{String(row.getValue("deliveryDate") ?? "")}</div>
      ),
    },
    {
      accessorKey: "clientName",
      header: t("columns.client"),
      cell: ({ row }) => <div>{String(row.getValue("clientName") ?? "")}</div>,
    },

    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.getValue("status") === "draft" && (
            <Badge variant="info">{t("statuses.draft")}</Badge>
          )}
          {row.getValue("status") === "sent" && (
            <Badge variant="warning">{t("statuses.sent")}</Badge>
          )}
          {row.getValue("status") === "accepted" && (
            <Badge variant="success">{t("statuses.accepted")}</Badge>
          )}
          {row.getValue("status") === "rejected" && (
            <Badge variant="destructive">{t("statuses.rejected")}</Badge>
          )}
          {row.getValue("status") === "expired" && (
            <Badge variant="warning">{t("statuses.expired")}</Badge>
          )}
        </div>
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
