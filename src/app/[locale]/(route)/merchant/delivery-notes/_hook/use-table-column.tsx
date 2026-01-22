import { Button } from "@/components/ui/button";
import type { DeliveryNote } from "@/lib/types";
import { useDeliveryNoteStore } from "@/store/merchant/delivery-note-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "../../_components/action-cell";

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
      accessorKey: "deliveryNoteNumber",
      header: t("columns.number"),
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          className="hover:bg-secondary h-8 px-2 font-medium hover:underline"
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
            <Badge variant="outline-info">{t("statuses.draft")}</Badge>
          )}
          {row.getValue("status") === "sent" && (
            <Badge variant="outline-warning">{t("statuses.sent")}</Badge>
          )}
          {row.getValue("status") === "accepted" && (
            <Badge variant="outline-success">{t("statuses.accepted")}</Badge>
          )}
          {row.getValue("status") === "rejected" && (
            <Badge variant="outline-destructive">
              {t("statuses.rejected")}
            </Badge>
          )}
          {row.getValue("status") === "expired" && (
            <Badge variant="outline-warning">{t("statuses.expired")}</Badge>
          )}
        </div>
      ),
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
    {
      id: "actions",
      header: t("columns.actions"),
      size: 100,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<DeliveryNoteRow>
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
