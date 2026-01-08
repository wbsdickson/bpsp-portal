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
              <MerchantMemberTable
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

          return <MerchantMemberDetail userId={tab.key} />;
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
