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

import { CreateMerchantItemModal } from "./_modal/create-merchant-item-modal";

export default function ItemsPage() {
  const t = useTranslations("Merchant.Items");
  const router = useRouter();
  const { basePath } = useBasePath();
  const { onOpen } = useModalStore();

  return (
    <HeaderPage title={t("title")}>
      <div className="flex items-center justify-end">
        <Button
          type="button"
          size="sm"
          className="h-9 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => onOpen("create-merchant-item")}
        >
          <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
        </Button>
      </div>
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
              <ItemTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<string>)
                }
              />
            );
          }

          return <ItemDetail itemId={tab.key} />;
        }}
      />
      <CreateMerchantItemModal />
    </HeaderPage>
  );
}
