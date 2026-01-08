"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import ReceivedPayableInvoiceDetail from "./_components/received-payable-invoice-detail";
import ReceivedPayableInvoiceTable from "./_components/received-payable-invoice-table";
import { useBasePath } from "@/hooks/use-base-path";

import { PayableInvoiceRow } from "./_components/received-payable-invoice-table";

export default function ReceivedPayableInvoicesPage() {
  const router = useRouter();
  const t = useTranslations("Operator.ReceivedPayableInvoices");
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
              <ReceivedPayableInvoiceTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<PayableInvoiceRow>)
                }
              />
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
