import { Badge } from "@/components/ui/badge";
import { getPayoutTransactionStatusBadgeVariant } from "./status";
import type { Payment, PaymentStatus } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import ActionsCell from "@/components/action-cell";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useBasePath } from "@/hooks/use-base-path";

export type PayoutTransaction = Payment & {
  merchantName: string;
  clientName: string;
  transactionDateLabel: string;
};

export default function usePayoutTransactionTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.PayoutTransactions");

  const router = useRouter();
  const { basePath } = useBasePath();

  const onOpenDetail = (id: string) => {
    router.push(`${basePath}/${id}`);
  };

  const columns: ColumnDef<PayoutTransaction>[] = [
    {
      accessorKey: "id",
      header: t("columns.transactionId"),
      cell: ({ row }) => (
        <>
          <Button
            variant="ghost"
            className="hover:bg-secondary h-8 px-2 font-medium hover:underline"
            onClick={() => addTab(String(row.getValue("id") ?? ""))}
          >
            {String(row.getValue("id") ?? "")}
          </Button>
        </>
      ),
    },
    {
      accessorKey: "merchantName",
      header: t("columns.merchantName"),
      cell: ({ row }) => (
        <div>{String(row.getValue("merchantName") ?? "")}</div>
      ),
    },
    {
      accessorKey: "clientName",
      header: t("columns.clientName"),
      cell: ({ row }) => <div>{String(row.getValue("clientName") ?? "")}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: t("columns.amount"),
      cell: ({ row }) => {
        const v = row.getValue("totalAmount");
        const num = typeof v === "number" ? v : Number(v ?? 0);
        return <div>{num.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "transactionDateLabel",
      header: t("columns.transactionDateTime"),
      cell: ({ row }) => (
        <div>{String(row.getValue("transactionDateLabel") ?? "")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: t("columns.payoutStatus"),
      cell: ({ row }) => {
        const status = String(row.getValue("status") ?? "") as PaymentStatus;

        const label = t(`statuses.${status}`);

        return (
          <Badge
            variant={getPayoutTransactionStatusBadgeVariant(
              status as PaymentStatus,
            )}
          >
            {label}
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
        <ActionsCell<PayoutTransaction>
          item={row.original}
          t={t}
          onOpenDetail={() => onOpenDetail(row.original.id)}
          variant="verbose"
        />
      ),
    },
  ];

  return { columns };
}
