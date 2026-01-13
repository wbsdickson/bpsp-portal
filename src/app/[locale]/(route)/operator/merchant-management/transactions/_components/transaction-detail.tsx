"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTransactionStore } from "@/store/transaction-store";
import { TitleField } from "@/components/title-field";
import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type PaymentStatus } from "@/lib/types";
import { getBadgeVariant } from "../_hook/status";

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

  const gatewayResponse = {
    id: transaction.id,
    object: "payment_intent",
    amount: transaction.amount,
    currency: "jpy",
    status: transaction.status,
    payment_method: "pm_card_visa",
    created: transaction.createdAt,
    metadata: {
      merchant_id: transaction.merchantId,
      invoice_id: transaction.invoiceId,
    },
    charges: {
      object: "list",
      data: [
        {
          id: `ch_${transaction.id.substring(0, 8)}`,
          paid: transaction.status === "settled",
          status:
            transaction.status === "settled" ? "succeeded" : transaction.status,
        },
      ],
    },
  };

  return (
    <div className="bg-card space-y-6 rounded-lg p-4">
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          <TitleField
            label={t("columns.transactionId")}
            value={transaction.id}
          />
          <TitleField
            label={t("columns.status")}
            value={
              <Badge variant={getBadgeVariant(transaction.status)}>
                {t(`statuses.${transaction.status}`)}
              </Badge>
            }
          />
          <TitleField
            label={t("columns.amount")}
            value={Number(transaction.totalAmount ?? 0).toLocaleString()}
          />
          <TitleField
            label={t("columns.transactionDateTime")}
            value={
              transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleString()
                : "—"
            }
          />
          <TitleField
            label="Merchant ID"
            value={<div className="font-mono">{transaction.merchantId}</div>}
          />
          <TitleField
            label="Invoice ID"
            value={<div className="font-mono">{transaction.invoiceId}</div>}
          />
          <TitleField
            label="Payment method"
            value={transaction.paymentMethod}
          />
          <TitleField label="Settled at" value={transaction.settledAt ?? "—"} />
        </div>
      </div>

      <div className="bg-card space-y-3">
        <h3 className="font-semibold">Payment Gateway Response</h3>
        <Separator />
        <div className="bg-muted/50 overflow-hidden">
          <pre className="overflow-x-auto font-mono text-xs">
            {JSON.stringify(gatewayResponse, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
