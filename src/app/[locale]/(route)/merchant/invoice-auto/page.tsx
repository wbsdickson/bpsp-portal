"use client";

import { useAppStore } from "@/lib/store";
import { AutoIssuanceList } from "./auto-issuance-list";
import HeaderPage from "@/components/header-page";

export default function InvoiceAutoPage() {
  const { currentUser } = useAppStore();

  if (!currentUser) return <div>Loading...</div>;

  const merchantId = currentUser.merchantId || currentUser.id;

  return (
    <HeaderPage title="Invoice Auto-Issuance">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <AutoIssuanceList merchantId={merchantId} />
      </div>
    </HeaderPage>
  );
}
