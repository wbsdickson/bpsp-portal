"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import MidFeeDetail from "./_components/mid-fee-detail";
import MidFeeTable from "./_components/mid-fee-table";

export default function MidFeePage() {
  const t = useTranslations("Operator.MIDFee");
  const router = useRouter();

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
            size="sm"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push("/operator/mid-fee/create")}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
          </Button>
        )}
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <MidFeeTable
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

          return <MidFeeDetail feeId={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
