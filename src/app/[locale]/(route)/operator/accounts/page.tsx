"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import UserDetail from "./_components/user-detail";
import UserTable from "./_components/user-table";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
  const t = useTranslations("Operator.Accounts");
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
            onClick={() => router.push(`/operator/accounts/create`)}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
          </Button>
        )}
        renderTab={(tab, helpers) => {
          if (tab.key === "table") {
            return (
              <UserTable
                addTab={(id) =>
                  helpers.addTab({
                    key: id,
                    label: id,
                    closable: true,
                  } satisfies RecordTab)
                }
              />
            );
          }
          return <UserDetail userId={tab.key} />;
        }}
      />
    </HeaderPage>
  );
}
