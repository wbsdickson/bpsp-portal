import ActionsCell from "@/components/action-cell";
import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DeliveryNote, DeliveryNoteStatus } from "@/lib/types";
import { useDeliveryNoteStore } from "@/store/delivery-note-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { getDeliveryNoteStatusBadgeVariant } from "./status";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";

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
    toast.success(t("messages.deleteSuccess"));
  };

  const column: ColumnDef<DeliveryNoteRow>[] = [
    {
      accessorKey: "deliveryNoteNumber",
      header: t("columns.number"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="hover:bg-secondary h-8 px-2 font-medium hover:underline"
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
        const value = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="font-medium">
              {`${getCurrencySymbol(value.currency)} ${formattedAmount(
                value.amount,
                value.currency,
              )}`}
            </div>
          </div>
        );
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
      cell: ({ row }) => {
        const status = row.original.status || "draft";

        return (
          <Badge
            variant={getDeliveryNoteStatusBadgeVariant(
              status as DeliveryNoteStatus,
            )}
          >
            {t(`statuses.${status}`)}
          </Badge>
        );
      },
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
