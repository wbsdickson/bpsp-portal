"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";

import DeliveryNoteDetail from "./_components/delivery-note-detail";
import DeliveryNoteTable from "./_components/delivery-note-table";

export default function OperatorDeliveryNotesPage() {
  const t = useTranslations("Operator.DeliveryNotes");

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
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <DeliveryNoteTable
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

          return <DeliveryNoteDetail deliveryNoteId={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
