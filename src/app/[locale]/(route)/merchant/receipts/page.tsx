"use client";

import { useAppStore } from "@/lib/store";
import { ReceiptList } from "./receipt-list";
import HeaderPage from "@/components/header-page";

export default function ReceiptsPage() {
  const { currentUser } = useAppStore();
  const merchantId = currentUser?.merchantId || currentUser?.id || "";

  if (!currentUser) {
    return <div>Please log in</div>;
  }

  return (
    <HeaderPage title="Receipts">
      <ReceiptList merchantId={merchantId} />
    </HeaderPage>
  );
}
