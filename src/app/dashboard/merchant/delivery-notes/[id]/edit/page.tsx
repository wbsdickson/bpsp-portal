"use client";

import { useAppStore } from "@/lib/store";
import { DeliveryNoteForm } from "../../delivery-note-form";
import { useParams } from "next/navigation";

export default function EditDeliveryNotePage() {
    const params = useParams();
    const id = params.id as string;
    const { currentUser, deliveryNotes } = useAppStore();
    const merchantId = currentUser?.id || "";

    const deliveryNote = deliveryNotes.find(dn => dn.id === id);

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    if (!deliveryNote) {
        return <div>Delivery Note not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Edit Delivery Note</h2>
                <p className="text-muted-foreground">
                    Update delivery note details.
                </p>
            </div>
            <DeliveryNoteForm merchantId={merchantId} initialData={deliveryNote} />
        </div>
    );
}
