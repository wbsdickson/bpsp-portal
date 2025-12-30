"use client";

import { useAppStore } from "@/lib/store";
import { AccountList } from "./account-list";
import HeaderPage from "@/components/header-page";

export default function AccountInformationManagementPage() {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return <div>Please log in</div>;
  }

  return (
    <HeaderPage title="Account Information Management">
      <AccountList />
    </HeaderPage>
  );
}
