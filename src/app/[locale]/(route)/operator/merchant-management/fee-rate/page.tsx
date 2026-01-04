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

export default function MerchantFeePage() {
  const t = useTranslations("Operator.MerchantFees");
  const router = useRouter();
  const { basePath } = useBasePath();
  const { onOpen } = useModalStore();

  return (
    <HeaderPage title={t("title")}>
      <div className="flex items-center justify-end">
        <Button
          type="button"
          size="sm"
          className="h-9 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => onOpen("create-merchant-fee")}
        >
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
              <MerchantFeeTable
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

          return <MerchantFeeDetail feeId={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
