"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import RecordTabs, { RecordTab } from "@/components/record-tabs";
import TransactionDetail from "./_components/transaction-detail";
import TransactionTable from "./_components/transaction-table";

import { Transaction } from "./_hook/use-table-column";

export default function OperatorTransactionsPage() {
  const t = useTranslations("Operator.Transactions");

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
              <div className="p-4">
                <TransactionTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<Transaction>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <TransactionDetail id={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
