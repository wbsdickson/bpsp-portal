"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import MidFeeDetail from "./_components/mid-fee-detail";
import MidFeeTable from "./_components/mid-fee-table";
import type { MidFeeRow } from "./_hook/use-table-column";
import { useBasePath } from "@/hooks/use-base-path";

export default function MidFeePage() {
  const t = useTranslations("Operator.MIDFee");
  const router = useRouter();
  const basePath = useBasePath();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button
          size="sm"
          className="h-9"
          onClick={() => router.push(`${basePath}/create`)}
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
              <MidFeeTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<MidFeeRow>)
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
