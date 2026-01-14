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
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button size="sm" onClick={() => router.push(`${basePath}/create`)}>
          <Plus /> {t("buttons.create")}
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
                    } satisfies RecordTab<string>)
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
      {/* <CreateMerchantItemModal /> */}
    </HeaderPage>
  );
}
