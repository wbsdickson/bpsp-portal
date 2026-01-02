"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import QuotationDetail from "./_components/quotation-detail";
import QuotationTable from "./_components/quotation-table";
import { useBasePath } from "@/hooks/use-base-path";

export default function OperatorQuotationsPage() {
  const router = useRouter();
  const t = useTranslations("Operator.Quotations");
  const { basePath } = useBasePath();

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
        renderRight={() => (
          <Button
            type="button"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push(`${basePath}/create`)}
          >
            {t("buttons.create")}
          </Button>
        )}
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <QuotationTable
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

          return <QuotationDetail quotationId={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
