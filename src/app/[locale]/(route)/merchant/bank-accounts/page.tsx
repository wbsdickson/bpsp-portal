"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";

import BankAccountDetail from "./_components/bank-account-detail";
import BankAccountTable from "./_components/bank-account-table";

export default function BankAccountsPage() {
  const t = useTranslations("Merchant.BankAccounts");

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
              <BankAccountTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<object>)
                }
              />
            );
          }

          return (
            <div className="p-4">
              <BankAccountDetail bankAccountId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
