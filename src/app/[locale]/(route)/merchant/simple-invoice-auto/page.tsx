"use client";

import { useAppStore } from "@/lib/store";
import { AutoIssuanceList } from "./auto-issuance-list";
import HeaderPage from "@/components/header-page";

export default function AutoIssuancePage() {
  const { currentUser } = useAppStore();
  const merchantId = currentUser?.merchantId || currentUser?.id || "";

  if (!currentUser) {
    return <div>Please log in</div>;
  }

  return (
    <HeaderPage title="Auto-Issuance">
      <AutoIssuanceList merchantId={merchantId} />
    </HeaderPage>
  );
}
