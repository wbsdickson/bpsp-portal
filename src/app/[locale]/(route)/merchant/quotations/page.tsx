"use client";

import { useAppStore } from "@/lib/store";
import { QuotationList } from "./quotation-list";
import HeaderPage from "@/components/header-page";

export default function QuotationsPage() {
  const { currentUser } = useAppStore();
  const merchantId = currentUser?.merchantId || currentUser?.id || "";

  if (!currentUser) {
    return <div>Please log in</div>;
  }

  return (
    <HeaderPage title="Quotations">
      <QuotationList merchantId={merchantId} />
    </HeaderPage>
  );
}
