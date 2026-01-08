"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";

import DeliveryNoteDetail from "./_components/delivery-note-detail";
import DeliveryNoteTable from "./_components/delivery-note-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import { useModalStore } from "@/store/modal-store";

import { DeliveryNoteRow } from "./_hook/use-table-column";

export default function OperatorDeliveryNotesPage() {
  const t = useTranslations("Operator.DeliveryNotes");
  const router = useRouter();
  const { basePath } = useBasePath();
  const onOpen = useModalStore((s) => s.onOpen);

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button
          onClick={() => router.push(`${basePath}/create`)}
          size="sm"
        >
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
              <DeliveryNoteTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<DeliveryNoteRow>)
                }
              />
            );
          }

          return (
            <div className="p-4">
              <DeliveryNoteDetail deliveryNoteId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
