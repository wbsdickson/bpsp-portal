"use client";

import { useAppStore } from "@/lib/store";
import { DeliveryNoteForm } from "../delivery-note-form";

export default function CreateDeliveryNotePage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Create Delivery Note</h2>
                <p className="text-muted-foreground">
                    Create a new delivery note for a client.
                </p>
            </div>
            <DeliveryNoteForm merchantId={merchantId} />
        </div>
    );
}
