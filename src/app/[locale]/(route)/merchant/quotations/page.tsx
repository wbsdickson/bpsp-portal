"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import QuotationDetail from "./_components/quotation-detail";
import QuotationTable from "./_components/quotation-table";
import { useBasePath } from "@/hooks/use-base-path";

import { QuotationRow } from "./_hook/use-table-column";

export default function MerchantQuotationsPage() {
  const router = useRouter();
  const t = useTranslations("Merchant.Quotations");
  const { basePath } = useBasePath();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700"
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
              <QuotationTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<QuotationRow>)
                }
              />
            );
          }

          return <QuotationDetail quotationId={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
