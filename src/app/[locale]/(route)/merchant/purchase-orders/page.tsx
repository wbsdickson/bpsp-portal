"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
        <Button onClick={() => router.push(`${basePath}/create`)} size="sm">
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
                <PurchaseOrderTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<PurchaseOrderRow>)
                  }
                />
              </div>
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
