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
        <Button
          type="button"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => router.push(`${basePath}/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
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

          return <ReceivedPayableInvoiceDetail id={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
