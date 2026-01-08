"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";

import MerchantFeeDetail from "./_components/merchant-fee-detail";
import MerchantFeeTable from "./_components/merchant-fee-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import { useModalStore } from "@/store/modal-store";
import { MerchantFeeRow } from "./_hook/use-table-column";

export default function MerchantFeePage() {
  const t = useTranslations("Operator.MerchantFees");
  const router = useRouter();
  const { basePath } = useBasePath();
  const { onOpen } = useModalStore();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button size="sm" onClick={() => onOpen("create-merchant-fee")}>
          <Plus /> Create {t("title")}
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
                <MerchantFeeTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<MerchantFeeRow>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <MerchantFeeDetail feeId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
