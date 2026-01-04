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
    <HeaderPage title={t("title")}>
      <div className="mb-2 flex justify-end">
        <Button type="button" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
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
              <MerchantAccountTable
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

          return <MerchantAccountDetail accountId={tab.key} />;
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
