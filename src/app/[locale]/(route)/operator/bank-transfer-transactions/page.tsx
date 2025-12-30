"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import BankTransferTransactionTable from "./_components/bank-transfer-transaction-table";
import RecordTabs, { RecordTab } from "@/components/record-tabs";
import BankTransferDetail from "./_components/bank-transfer-detail";

export default function OperatorBankTransferTransactionsPage() {
  const t = useTranslations("Operator.BankTransferTransactions");

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
              <BankTransferTransactionTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab)
                }
              />
            );
          }

          return <BankTransferDetail id={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
