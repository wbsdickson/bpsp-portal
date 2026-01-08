"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import RecordTabs, { RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import MerchantAccountUpsertForm from "./_components/account-upsert-form";

import MerchantAccountTable from "./_components/account-table";
import MerchantAccountDetail from "./_components/account-detail";

export default function MerchantAccountsPage() {
  const t = useTranslations("Merchant.AccountInformationManagement");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button size="sm" onClick={() => setModalOpen(true)}>
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
        defaultActiveKey="table"
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <div className="p-4">
                <MerchantAccountTable
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
              <MerchantAccountDetail accountId={tab.key} />
            </div>
          );
        }}
      />
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent>
          <MerchantAccountUpsertForm onSuccess={() => setModalOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </HeaderPage>
  );
}
