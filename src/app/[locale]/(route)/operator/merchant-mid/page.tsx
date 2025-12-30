"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";

import MerchantMidDetail from "./_components/merchant-mid-detail";
import MerchantMidTable from "./_components/merchant-mid-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MerchantMidPage() {
  const t = useTranslations("Operator.MerchantMIDs");
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
            onClick={() => router.push("/operator/merchant-mid/create")}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
          </Button>
        )}
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <MerchantMidTable
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

          return <MerchantMidDetail midId={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
