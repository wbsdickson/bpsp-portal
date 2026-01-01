"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import MerchantMemberTable from "./_components/merchant-member-table";
import RecordTabs, { RecordTab } from "@/components/record-tabs";
import MerchantMemberDetail from "./_components/merchant-member-detail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MerchantMembersPage() {
  const t = useTranslations("Merchant.MerchantMembers");
  const router = useRouter();

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
              router.push(`/merchant/member/create`);
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
                  } satisfies RecordTab)
                }
              />
            );
          }

          return <MerchantMemberDetail userId={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
