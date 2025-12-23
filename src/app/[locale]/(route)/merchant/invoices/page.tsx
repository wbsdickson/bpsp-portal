"use client";

import { useAppStore } from "@/lib/store";
import { InvoiceList } from "./invoice-list";
import HeaderPage from "@/components/header-page";

export default function InvoicesPage() {
  const { currentUser } = useAppStore();

  if (!currentUser) return <div>Loading...</div>;

  const merchantId = currentUser.merchantId || currentUser.id;

  return (
    <HeaderPage title="Invoice Management">
      <InvoiceList merchantId={merchantId} />
    </HeaderPage>
  );
}
