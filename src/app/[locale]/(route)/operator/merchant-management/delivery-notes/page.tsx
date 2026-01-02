"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";

import DeliveryNoteDetail from "./_components/delivery-note-detail";
import DeliveryNoteTable from "./_components/delivery-note-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";

export default function OperatorDeliveryNotesPage() {
  const t = useTranslations("Operator.DeliveryNotes");
  const router = useRouter();
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
