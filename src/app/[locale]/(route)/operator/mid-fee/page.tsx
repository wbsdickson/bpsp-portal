"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import MidFeeDetail from "./_components/mid-fee-detail";
import MidFeeTable from "./_components/mid-fee-table";
import type { MidFeeRow } from "./_hook/use-table-column";
import { useModalStore } from "@/store/modal-store";

export default function MidFeePage() {
  const t = useTranslations("Operator.MIDFee");
  const { onOpen } = useModalStore();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button
          size="sm"
          className="h-9"
          onClick={() => onOpen("create-mid-fee")}
        >
          <Plus /> {t("form.createTitle")}
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
              <div className="p-4">
                <MidFeeTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<MidFeeRow>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <MidFeeDetail feeId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
