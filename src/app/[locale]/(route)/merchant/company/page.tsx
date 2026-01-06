"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import RecordTabs, { RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import MerchantCompanyTable from "./_components/company-table";
import MerchantCompanyDetail from "./_components/company-detail";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import MerchantCompanyUpsertForm from "./_components/company-upsert-form";
import { useState } from "react";

export default function MerchantCompaniesPage() {
  const t = useTranslations("Merchant.CompanyInformationManagement");
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
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
        renderRight={() => (
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
          </Button>
        )}
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <MerchantCompanyTable
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

          return <MerchantCompanyDetail companyId={tab.key} />;
        }}
      />
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent>
          <MerchantCompanyUpsertForm onSuccess={() => setModalOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </HeaderPage>
  );
}
