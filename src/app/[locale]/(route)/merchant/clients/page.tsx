"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import ClientDetail from "./_components/client-detail";
import ClientTable from "./_components/client-table";

export default function ClientsPage() {
  const t = useTranslations("Merchant.Clients");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { basePath } = useBasePath();

  const activeTab = searchParams.get("tab") || "table";

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
        defaultActiveKey={activeTab}
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <div className="p-4">
                <ClientTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<object>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <ClientDetail clientId={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
