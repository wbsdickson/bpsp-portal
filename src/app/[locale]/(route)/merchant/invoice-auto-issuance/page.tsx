"use client";

import HeaderPage from "@/components/header-page";
import InvoiceTable from "./_components/invoice-table";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import InvoiceDetail from "./_components/invoice-detail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";

import { AutoIssuanceRow } from "./_hooks/use-table-column";

export default function InvoiceAutoIssuancePage() {
  const router = useRouter();
  const t = useTranslations("Merchant.InvoiceAutoIssuance");
  const { basePath } = useBasePath();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button
          onClick={() => router.push(`${basePath}/create`)}
          size="sm"
          
        >
          <Plus /> {t("create")}
        </Button>
      }
    >
      <div className="flex items-center justify-end"></div>
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
                <InvoiceTable
                  addTab={(id) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<AutoIssuanceRow>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <InvoiceDetail id={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
