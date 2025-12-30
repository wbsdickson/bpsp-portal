import { Badge } from "@/components/ui/badge";
import type { Payment, PaymentStatus } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import ActionsCell from "../../_components/action-cell";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type BankTransferTransactionRow = Payment & {
  merchantName: string;
  clientName: string;
  transactionDateLabel: string;
};

export default function useBankTransferTransactionTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.BankTransferTransactions");

  const router = useRouter();

  const onOpenDetail = (item: BankTransferTransactionRow) => {
    router.push(`/operator/bank-transfer-transactions/${item.id}`);
  };

  const columns: ColumnDef<BankTransferTransactionRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<BankTransferTransactionRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          t={t}
        />
      ),
    },
    {
      accessorKey: "id",
      header: t("columns.transactionId"),
      cell: ({ row }) => (
        <>
          <Button
            variant="ghost"
            className="h-8 px-2 font-medium"
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
        const variant: "default" | "secondary" | "destructive" | "outline" =
          status === "settled"
            ? "default"
            : status === "failed"
              ? "destructive"
              : "secondary";

        return <Badge variant={variant}>{label}</Badge>;
      },
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
  ];

  return { columns };
}
