"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePayoutTransactionStore } from "@/store/payout-transaction-store";
import { useBankAccountStore } from "@/store/bank-account-store";
import { useInvoiceStore } from "@/store/invoice-store";
import { useClientStore } from "@/store/client-store";
import { useMerchantStore } from "@/store/merchant-store";
import { Badge } from "@/components/ui/badge";
import { TitleField } from "@/components/title-field";
import { getPayoutTransactionBadgeVariant } from "../_hook/status";
import { PaymentStatus } from "@/lib/types";

export default function PayoutTransactionDetail({ id }: { id?: string }) {
  const t = useTranslations("Operator.PayoutTransactions");

  const transaction = usePayoutTransactionStore((s) =>
    id ? s.getById(id) : undefined,
  );

  const bankAccounts = useBankAccountStore((s) => s.bankAccounts);
  const invoices = useInvoiceStore((s) => s.invoices);
  const clients = useClientStore((s) => s.clients);
  const merchants = useMerchantStore((s) => s.merchants);

  const merchantName = (() => {
    const merchantId = transaction?.merchantId;
    if (!merchantId) return "—";
    return merchants.find((m) => m.id === merchantId)?.name ?? "—";
  })();

  const clientName = (() => {
    const invoiceId = transaction?.invoiceId;
    if (!invoiceId) return "—";
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    const clientId = (invoice as { clientId?: string } | undefined)?.clientId;
    if (!clientId) return "—";
    return clients.find((c) => c.id === clientId)?.name ?? "—";
  })();

  const bankTransferAccountLabel = (() => {
    const merchantId = transaction?.merchantId;
    if (!merchantId) return "—";

    const acct = bankAccounts.find(
      (a) => a.merchantId === merchantId && !a.deletedAt,
    );
    if (!acct) return "—";
    const branch = acct.branchName ? ` ${acct.branchName}` : "";
    return `${acct.bankName}${branch} / ${acct.accountType} / ${acct.accountNumber} / ${acct.accountHolder}`;
  })();

  if (!id) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          Missing transaction id.
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`/operator/payout-transactions`}>
            {t("buttons.back")}
          </Link>
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
          <Link href={`/operator/payout-transactions`}>
            {t("buttons.back")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card space-y-4 rounded-lg p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TitleField
          label={t("columns.transactionId")}
          value={<span className="font-mono">{transaction.id}</span>}
        />
        <TitleField
          label={t("columns.payoutStatus")}
          value={
            <span className="capitalize">
              <Badge
                variant={getPayoutTransactionBadgeVariant(
                  (transaction.status as PaymentStatus) || "pending_approval",
                )}
              >
                {t(`statuses.${transaction.status}`)}
              </Badge>
            </span>
          }
        />
        <TitleField label={t("columns.merchantName")} value={merchantName} />
        <TitleField label={t("columns.clientName")} value={clientName} />
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
        <div className="md:col-span-2">
          <TitleField
            label={t("columns.bankTransferAccount")}
            value={
              <span className="break-all">{bankTransferAccountLabel}</span>
            }
          />
        </div>
      </div>
    </div>
  );
}
