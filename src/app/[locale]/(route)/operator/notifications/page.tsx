"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import NotificationTable from "./_components/notification-table";
import RecordTabs, { RecordTab } from "@/components/record-tabs";
import NotificationDetail from "./_components/notification-detail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { NotificationRow } from "./_hook/use-table-column";
import { useBasePath } from "@/hooks/use-base-path";

export default function OperatorNotificationsPage() {
  const t = useTranslations("Operator.Notifications");
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
          <Plus /> Create {t("title")}
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
              <NotificationTable
                addTab={(id: string) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab<NotificationRow>)
                }
              />
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
