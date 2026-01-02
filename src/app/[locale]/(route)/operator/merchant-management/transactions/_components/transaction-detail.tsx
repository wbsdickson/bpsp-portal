"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTransactionStore } from "@/store/transaction-store";

export default function TransactionDetail({ id }: { id: string }) {
  const t = useTranslations("Operator.Transactions");

  const transaction = useTransactionStore((s) =>
    id ? s.getById(id) : undefined,
  );

  if (!id) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          Missing transaction id.
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`/operator/transactions`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`/operator/transactions`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background space-y-3 rounded-lg border p-4">
      <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
        <div>
          <div className="text-muted-foreground">
            {t("columns.transactionId")}
          </div>
          <div className="font-mono">{transaction.id}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{t("columns.status")}</div>
          <div className="capitalize">{transaction.status}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{t("columns.amount")}</div>
          <div>{Number(transaction.totalAmount ?? 0).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-muted-foreground">
            {t("columns.transactionDateTime")}
          </div>
          <div>
            {transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleString()
              : "—"}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Merchant ID</div>
          <div className="font-mono">{transaction.merchantId}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Invoice ID</div>
          <div className="font-mono">{transaction.invoiceId}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Payment method</div>
          <div>{transaction.paymentMethod}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Settled at</div>
          <div>{transaction.settledAt ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
