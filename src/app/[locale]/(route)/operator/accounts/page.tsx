"use client";

import HeaderPage from "@/components/header-page";
import RecordTabs, { type RecordTab } from "@/components/record-tabs";
import UserDetail from "./_components/user-detail";
import UserTable from "./_components/user-table";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/modal-store";
import { UserRow } from "./_hook/use-table-column";

export default function AccountsPage() {
  const t = useTranslations("Operator.Accounts");
  const { onOpen } = useModalStore();

  return (
    <HeaderPage
      title={t("title")}
      pageActions={
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => onOpen("create-account")}
        >
          <Plus className="mr-2 h-4 w-4" /> {t("buttons.create")}
        </Button>
      }
    >
      <RecordTabs<UserRow>
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
              <UserTable
                addTab={(item) =>
                  helpers.addTab({
                    key: item.name,
                    label: item.name,
                    closable: true,
                    data: item,
                  } satisfies RecordTab<UserRow>)
                }
              />
            );
          }
          return <UserDetail userId={tab.data?.id ?? ""} />;
        }}
      />
    </HeaderPage>
  );
}
