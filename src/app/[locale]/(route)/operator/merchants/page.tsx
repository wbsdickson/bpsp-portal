"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import MerchantTable from "./_components/merchant-table";
import { useTranslations } from "next-intl";
import MerchantDetail from "./_components/merchant-detail";
import type { MerchantRow } from "./_hook/use-table-column";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { Can } from "@/components/can";
import { toast } from "sonner";

export default function MerchantsPage() {
  const t = useTranslations("Operator.Merchants");

  const handleViewDetails = () => {
    toast.info(t("buttons.viewDetails"));
  };

  const handleDeleteMerchant = () => {
    toast.info(t("buttons.deleteMerchant"));
  };

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <div className="flex gap-2">
          <Can I="read" a="Merchant">
            <Button variant="outline" size="sm" onClick={handleViewDetails}>
              <Eye className="mr-2 h-4 w-4" />
              Dummy view details
            </Button>
          </Can>
          <Can I="delete" a="Merchant">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteMerchant}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Dummy delete
            </Button>
          </Can>
        </div>
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
                <MerchantTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<MerchantRow>)
                  }
                />
              </div>
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
