"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import ReceiptDetail from "./_components/receipt-detail";
import ReceiptTable from "./_components/receipt-table";
import { useBasePath } from "@/hooks/use-base-path";

import { ReceiptRow } from "./_components/receipt-table";

export default function ReceiptPage() {
  const router = useRouter();
  const t = useTranslations("Operator.Receipt");
  const { basePath } = useBasePath();

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
              <ReceiptTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<ReceiptRow>)
                }
              />
            );
          }

          return <ReceiptDetail id={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
