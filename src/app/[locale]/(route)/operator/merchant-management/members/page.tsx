"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import MerchantMemberTable from "./_components/merchant-member-table";
import RecordTabs, { RecordTab } from "@/components/record-tabs";
import MerchantMemberDetail from "./_components/merchant-member-detail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import { useModalStore } from "@/store/modal-store";
import { MerchantMemberRow } from "./_hook/use-table-column";

export default function MerchantMembersPage() {
  const t = useTranslations("Operator.MerchantMembers");
  const { onOpen } = useModalStore();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button size="sm" onClick={() => onOpen("create-merchant-member")}>
          <Plus /> Create {t("title")}
        </Button>
      }
    >
      <RecordTabs<MerchantMemberRow>
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
              <MerchantMemberTable
                addTab={(item) =>
                  helpers.addTab({
                    key: item.id,
                    label: item.name,
                    closable: true,
                    data: item,
                  } satisfies RecordTab<MerchantMemberRow>)
                }
              />
            );
          }

          return (
            <div className="p-4">
              <MerchantMemberDetail userId={tab.data?.id ?? ""} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
