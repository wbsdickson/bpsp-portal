"use client";

import HeaderPage from "@/components/header-page";
import InvoiceTable from "./_components/invoice-table";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import InvoiceDetail from "./_components/invoice-detail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { InvoiceRow } from "./_hooks/use-table-column";
import { useModalStore } from "@/store/modal-store";
import { InvoiceUpsertModal } from "./_modal/invoice-upsert-modal";

export default function InvoicesPage() {
  const t = useTranslations("Operator.Invoice");
  const { onOpen } = useModalStore();

  return (
    <>
      <HeaderPage
        title={t("title")}
        pageActions={
          <Button
            onClick={() => onOpen("create-invoice")}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" /> {t("create")}
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
                <InvoiceTable
                  addTab={(id) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<InvoiceRow>)
                  }
                />
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
      <InvoiceUpsertModal />
    </>
  );
}
