"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import PurchaseOrderDetail from "./_components/purchase-order-detail";
import PurchaseOrderTable from "./_components/purchase-order-table";
import { useBasePath } from "@/hooks/use-base-path";

import { PurchaseOrderRow } from "./_hook/use-table-column";

export default function MerchantPurchaseOrdersPage() {
  const router = useRouter();
  const t = useTranslations("Merchant.PurchaseOrders");
  const { basePath } = useBasePath();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button
          
          onClick={() => router.push(`${basePath}/create`)}
        >
          {t("buttons.create")}
        </Button>
      }
    >
      <div className="flex justify-end"></div>
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
              <PurchaseOrderTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<PurchaseOrderRow>)
                }
              />
            );
          }

          return (
            <div className="p-4">
              <PurchaseOrderDetail purchaseOrderId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
