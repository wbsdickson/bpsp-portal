"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import BankAccountDetail from "./_components/bank-account-detail";
import BankAccountTable from "./_components/bank-account-table";
import { CreateBankAccountModal } from "./_modal/create-merchant-bank-modal";
import { useModalStore } from "@/store/modal-store";

export default function BankAccountsPage() {
  const t = useTranslations("Merchant.BankAccounts");
  const searchParams = useSearchParams();
  const { onOpen } = useModalStore();

  const activeTab = searchParams.get("tab") || "table";

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button size="sm" onClick={() => onOpen("create-bank-account")}>
          <Plus /> {t("buttons.create")}
        </Button>
      }
    >
      <RecordTabs
        initialTabs={[
          {
            label: t("tabs.all"),
            key: "table",
            closable: false,
          },
        ]}
        defaultActiveKey={activeTab}
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <div className="p-4">
                <BankAccountTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<object>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <BankAccountDetail bankAccountId={tab.key} />
            </div>
          );
        }}
      />
      <CreateBankAccountModal />
    </HeaderPage>
  );
}
