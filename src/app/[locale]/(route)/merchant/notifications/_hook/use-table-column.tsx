import ActionsCell from "@/components/action-cell";
import { Button } from "@/components/ui/button";
import type { MerchantNotification, Notification } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { Badge } from "@/components/ui/badge";

export type PublicationStatus = "scheduled" | "published" | "expired";

export type NotificationRow = MerchantNotification & {
  publicationStatus: PublicationStatus;
  target: string;
  readStatus: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export default function useNotificationTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.Notifications");
  const router = useRouter();
  const { basePath } = useBasePath();

  const column: ColumnDef<NotificationRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<NotificationRow>
          item={row.original}
          t={t}
          actions={[
            {
              title: t("actions.view"),
              onPress: (item) => router.push(`${basePath}/${item.id}`),
            },
          ]}
        />
      ),
    },
    {
      accessorKey: "id",
      header: t("columns.id"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="hover:bg-secondary h-8 px-2 font-medium hover:underline"
          onClick={() => addTab(String(row.getValue("id") ?? ""))}
        >
          {String(row.getValue("id") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "title",
      header: t("columns.title"),
      cell: ({ row }) => (
        <div className="font-medium">{String(row.getValue("title") ?? "")}</div>
      ),
    },

    {
      accessorKey: "publicationDate",
      header: t("columns.publicationDate"),
      cell: ({ row }) => (
        <div>{String(row.getValue("publicationDate") ?? "")}</div>
      ),
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
    {
      accessorKey: "target",
      header: t("columns.target"),
      cell: ({ row }) => (
        <div className="capitalize">{String(row.getValue("target") ?? "")}</div>
      ),
    },
    {
      accessorKey: "readStatus",
      header: t("columns.readStatus"),
      cell: ({ row }) => (
        <div>
          <Badge variant={row.original.readStatus ? "success" : "secondary"}>
            {row.original.readStatus
              ? t("statuses.read")
              : t("statuses.unread")}
          </Badge>
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const rowValue = row.getValue(columnId) as boolean;

        if (Array.isArray(filterValue)) {
          if (filterValue.length === 0) return true;
          const statusString = rowValue ? "read" : "unread";
          return filterValue.includes(statusString);
        }

        const statusString = rowValue ? "read" : "unread";
        return statusString === String(filterValue);
      },
    },
  ];

  return { column };
}
