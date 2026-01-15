"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import MerchantMemberTable from "./_components/merchant-member-table";
import RecordTabs, { RecordTab } from "@/components/record-tabs";
import MerchantMemberDetail from "./_components/merchant-member-detail";

export default function MerchantMembersPage() {
  const t = useTranslations("Merchant.MerchantMembers");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { basePath } = useBasePath();

  const activeTab = searchParams.get("tab") || "table";

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button size="sm" onClick={() => router.push(`${basePath}/create`)}>
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
    </HeaderPage>
  );
}
