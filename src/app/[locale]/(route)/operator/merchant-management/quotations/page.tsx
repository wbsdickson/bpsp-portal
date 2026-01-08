"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import QuotationDetail from "./_components/quotation-detail";
import QuotationTable from "./_components/quotation-table";
import { useBasePath } from "@/hooks/use-base-path";

import { QuotationRow } from "./_hook/use-table-column";

export default function OperatorQuotationsPage() {
  const router = useRouter();
  const t = useTranslations("Operator.Quotations");
  const { basePath } = useBasePath();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button onClick={() => router.push(`${basePath}/create`)} size="sm">
          <Plus className="h-4 w-4" /> Create {t("title")}
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

          return (
            <div className="p-4">
              <QuotationDetail quotationId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
