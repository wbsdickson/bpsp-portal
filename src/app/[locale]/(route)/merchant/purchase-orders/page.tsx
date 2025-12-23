"use client";

import { useAppStore } from "@/lib/store";
import { PurchaseOrderList } from "./purchase-order-list";
import HeaderPage from "@/components/header-page";

export default function PurchaseOrdersPage() {
  const { currentUser } = useAppStore();
  const merchantId = currentUser?.merchantId || currentUser?.id || "";

  if (!currentUser) {
    return <div>Please log in</div>;
  }

  return (
    <HeaderPage title="Purchase Orders">
      <PurchaseOrderList merchantId={merchantId} />
    </HeaderPage>
  );
}
