"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import BankAccountDetail from "./_components/bank-account-detail";
import BankAccountTable from "./_components/bank-account-table";

export default function BankAccountsPage() {
  const t = useTranslations("Merchant.BankAccounts");
  const { basePath } = useBasePath();
  const router = useRouter();

  return (
    <HeaderPage title={t("title")}>
      <div className="flex justify-end">
        <Button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => router.push(`${basePath}/create`)}
        >
          {t("buttons.create")}
        </Button>
      </div>
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
