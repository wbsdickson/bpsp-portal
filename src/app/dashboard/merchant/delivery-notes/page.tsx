"use client";

import { useAppStore } from "@/lib/store";
import { DeliveryNoteList } from "./delivery-note-list";

export default function DeliveryNotesPage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.merchantId || currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Delivery Notes</h2>
                <p className="text-muted-foreground">
                    Manage your delivery notes.
                </p>
            </div>
            <DeliveryNoteList merchantId={merchantId} />
        </div>
    );
}
