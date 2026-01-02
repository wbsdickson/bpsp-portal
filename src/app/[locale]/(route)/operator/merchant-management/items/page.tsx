"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import ItemTable from "./_components/item-table";
import ItemDetail from "./_components/item-detail";
import RecordTabs, { RecordTab } from "@/components/record-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";

export default function ItemsPage() {
  const t = useTranslations("Operator.Items");
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
        renderRight={() => (
          <Button
            type="button"
            size="sm"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push(`${basePath}/create`)}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
          </Button>
        )}
        defaultActiveKey="table"
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <ItemTable
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

          return <ItemDetail itemId={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
