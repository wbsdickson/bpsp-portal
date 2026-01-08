"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import MerchantTable from "./_components/merchant-table";
import { useTranslations } from "next-intl";
import MerchantDetail from "./_components/merchant-detail";
import type { MerchantRow } from "./_hook/use-table-column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MerchantsPage() {
  const t = useTranslations("Operator.Merchants");
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
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <MerchantTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<MerchantRow>)
                }
              />
            );
          }

          return (
            <div className="p-4">
              <MerchantDetail merchantId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
