import ActionsCell from "@/components/action-cell";
import { StatusBadge } from "@/components/status-badge";
import { getNotificationStatusBadgeVariant } from "./status";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";

export type PublicationStatus = "scheduled" | "published" | "expired";

export type NotificationRow = Notification & {
  publicationStatus: PublicationStatus;
  publicationStartLabel: string;
  publicationEndLabel: string;
  targetMerchantsCount: number;
};

export default function useNotificationTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Notifications");
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
            {
              title: t("actions.edit"),
              onPress: (item) => router.push(`${basePath}/edit/${item.id}`),
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
          className="h-8 px-2 font-medium"
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
      accessorKey: "publicationStatus",
      header: t("columns.publicationStatus"),
      cell: ({ row }) => (
        <StatusBadge
          variant={getNotificationStatusBadgeVariant(
            (row.getValue("publicationStatus") as PublicationStatus) ||
              "expired",
          )}
        >
          {t(`statuses.${String(row.getValue("publicationStatus") ?? "")}`)}
        </StatusBadge>
      ),
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
    {
      accessorKey: "publicationStartLabel",
      header: t("columns.publicationStartDate"),
      cell: ({ row }) => (
        <div>{String(row.getValue("publicationStartLabel") ?? "")}</div>
      ),
    },
    {
      accessorKey: "publicationEndLabel",
      header: t("columns.publicationEndDate"),
      cell: ({ row }) => (
        <div>{String(row.getValue("publicationEndLabel") ?? "")}</div>
      ),
    },
    {
      accessorKey: "targetMerchantsCount",
      header: t("columns.targetMerchantsCount"),
      cell: ({ row }) => (
        <div>{Number(row.getValue("targetMerchantsCount") ?? 0)}</div>
      ),
    },
  ];

  return { column };
}
