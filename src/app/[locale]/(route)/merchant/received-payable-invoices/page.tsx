"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import ReceivedPayableInvoiceDetail from "./_components/received-payable-invoice-detail";
import ReceivedPayableInvoiceTable from "./_components/received-payable-invoice-table";
import MonthlySummary from "./_components/monthly-summary";
import { useBasePath } from "@/hooks/use-base-path";

import { PayableInvoiceRow } from "./_components/received-payable-invoice-table";

export default function ReceivedPayableInvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Merchant.ReceivedPayableInvoices");
  const { basePath } = useBasePath();

  // Get the active tab from URL parameters, default to "summary"
  const activeTab = searchParams.get("tab") || "summary";

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button onClick={() => router.push(`${basePath}/create`)} size="sm">
          <Plus /> Create {t("title")}
        </Button>
      }
    >
      <RecordTabs
        initialTabs={[
          {
            label: t("tabs.summary"),
            key: "summary",
            closable: false,
          },
          {
            label: t("tabs.all"),
            key: "table",
            closable: false,
          },
        ]}
        defaultActiveKey={activeTab}
        renderTab={(tab, helpers) => {
          if (tab.key === "summary") {
            return <MonthlySummary />;
          }
          
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
