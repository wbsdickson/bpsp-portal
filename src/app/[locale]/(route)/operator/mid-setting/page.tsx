"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import MidDetail from "./_components/mid-detail";
import MidTable from "./_components/mid-table";
import type { MidRow } from "./_hook/use-table-column";
import { useModalStore } from "@/store/modal-store";

export default function MidPage() {
  const t = useTranslations("Operator.MID");
  const { onOpen } = useModalStore();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button
          size="sm"
          className="h-9"
          onClick={() => onOpen("create-mid-setting")}
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
                <MidTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<MidRow>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <MidDetail id={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
