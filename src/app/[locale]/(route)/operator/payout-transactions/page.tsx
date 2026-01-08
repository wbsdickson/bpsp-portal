"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import RecordTabs, { RecordTab } from "@/components/record-tabs";
import PayoutTransactionDetail from "./_components/payout-transaction-detail";
import PayoutTransactionTable from "./_components/payout-transaction-table";
import type { PayoutTransaction } from "./_hook/use-table-column";

export default function OperatorPayoutTransactionsPage() {
  const t = useTranslations("Operator.PayoutTransactions");

  return (
    <HeaderPage title={t("title")}>
      <RecordTabs
        initialTabs={[
          {
            label: t("tabs.all"),
            key: "table",
            closable: false,
          },
        ]}
        defaultActiveKey="table"
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <PayoutTransactionTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<PayoutTransaction>)
                }
              />
            );
          }

          return (
            <div className="p-4">
              <PayoutTransactionDetail id={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
