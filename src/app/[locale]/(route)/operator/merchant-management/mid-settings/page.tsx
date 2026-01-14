"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";

import MerchantMidDetail from "./_components/merchant-mid-detail";
import MerchantMidTable from "./_components/merchant-mid-table";
import type { MerchantMidRow } from "./_hook/use-table-column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useModalStore } from "@/store/modal-store";

export default function MerchantMidsPage() {
  const t = useTranslations("Operator.MerchantMIDs");
  const { onOpen } = useModalStore();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button size="sm" onClick={() => onOpen("create-merchant-mid")}>
          <Plus /> Create {t("title")}
        </Button>
      }
    >
      <RecordTabs<MerchantMidRow>
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
                <MerchantMidTable
                  addTab={(item) =>
                    helpers.addTab({
                      key: item.id,
                      label: item.mid,
                      closable: true,
                      data: item,
                    } satisfies RecordTab<MerchantMidRow>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <MerchantMidDetail midId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
