"use client";

import HeaderPage from "@/components/header-page";
import InvoiceTable from "./_components/invoice-table";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import InvoiceDetail from "./_components/invoice-detail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function InvoicesPage() {
  const router = useRouter();
  const t = useTranslations("Operator.Invoice");
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
            onClick={() => router.push(`/operator/invoices/create`)}
            size="sm"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> {t("create")}
          </Button>
        )}
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <InvoiceTable
                addTab={(id) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab)
                }
              />
            );
          }

          return <InvoiceDetail id={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
