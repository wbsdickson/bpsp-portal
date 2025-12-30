"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import NotificationTable from "./_components/notification-table";
import RecordTabs, { RecordTab } from "@/components/record-tabs";
import NotificationDetail from "./_components/notification-detail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OperatorNotificationsPage() {
  const t = useTranslations("Operator.Notifications");
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
        renderRight={() => (
          <Button
            type="button"
            size="sm"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push(`/operator/notifications/create`)}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
          </Button>
        )}
        defaultActiveKey="table"
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <NotificationTable
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

          return <NotificationDetail id={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
