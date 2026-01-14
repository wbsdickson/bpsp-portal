"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import NotificationTable from "./_components/notification-table";
import RecordTabs, { RecordTab } from "@/components/record-tabs";
import NotificationDetail from "./_components/notification-detail";

import { useRouter } from "next/navigation";
import type { NotificationRow } from "./_hook/use-table-column";
import { useBasePath } from "@/hooks/use-base-path";

export default function MerchantNotificationsPage() {
  const t = useTranslations("Merchant.Notifications");
  const router = useRouter();
  const basePath = useBasePath();

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
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <div className="p-4">
                <NotificationTable
                  addTab={(id: string) =>
                    helpers.addTab({
                      key: id,
                      label: id,
                      closable: true,
                    } satisfies RecordTab<NotificationRow>)
                  }
                />
              </div>
            );
          }

          return (
            <div className="p-4">
              <NotificationDetail id={tab.key} />
            </div>
          );
        }}
      />
    </HeaderPage>
  );
}
