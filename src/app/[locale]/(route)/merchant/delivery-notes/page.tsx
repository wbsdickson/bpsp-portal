"use client";

import { useAppStore } from "@/lib/store";
import { DeliveryNoteList } from "./delivery-note-list";
import HeaderPage from "@/components/header-page";

export default function DeliveryNotesPage() {
  const { currentUser } = useAppStore();
  const merchantId = currentUser?.merchantId || currentUser?.id || "";

  if (!currentUser) {
    return <div>Please log in</div>;
  }

  return (
    <HeaderPage title="Delivery Notes">
      <DeliveryNoteList merchantId={merchantId} />
    </HeaderPage>
  );
}
