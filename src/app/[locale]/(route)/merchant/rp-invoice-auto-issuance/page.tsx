"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import ReceivedPayableInvoiceDetail from "./_components/received-payable-invoice-detail";
import ReceivedPayableInvoiceTable from "./_components/received-payable-invoice-table";
import { useBasePath } from "@/hooks/use-base-path";

import { PayableInvoiceRow } from "./_components/received-payable-invoice-table";

export default function ReceivedPayableInvoicesAutoIssuancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Merchant.ReceivedPayableInvoiceAutoIssuance");
  const { basePath } = useBasePath();

  const activeTab = searchParams.get("tab") || "table";

  return (
    <HeaderPage
      title={t("title")}
      capitalizeTitle={false}
      pageActions={
        <Button onClick={() => router.push(`${basePath}/create`)} size="sm">
          <Plus /> {t("create")}
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
                <ReceivedPayableInvoiceTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<PayableInvoiceRow>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <ReceivedPayableInvoiceDetail id={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
