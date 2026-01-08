"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import MerchantMemberTable from "./_components/merchant-member-table";
import RecordTabs, { RecordTab } from "@/components/record-tabs";
import MerchantMemberDetail from "./_components/merchant-member-detail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import MerchantMemberUpsertForm from "./_components/merchant-member-upsert-form";
import { useState } from "react";

export default function MerchantMembersPage() {
  const t = useTranslations("Merchant.MerchantMembers");
  const router = useRouter();
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
                <MerchantMemberTable
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
              <MerchantMemberDetail userId={tab.key} />
            </div>
          );
        }}
      />
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent>
          <MerchantMemberUpsertForm onSuccess={() => setModalOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </HeaderPage>
  );
}
