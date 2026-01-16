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
import { useModalStore } from "@/store/modal-store";
import { ItemRow } from "./_hook/use-table-column";

export default function ItemsPage() {
  const t = useTranslations("Operator.Items");
  const router = useRouter();
  const { basePath } = useBasePath();
  const { onOpen } = useModalStore();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button onClick={() => onOpen("create-merchant-item")} size="sm">
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
                <ItemTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<ItemRow>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <ItemDetail itemId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
