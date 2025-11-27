"use client";

import { useAppStore } from "@/lib/store";
import { ReceiptForm } from "../receipt-form";

export default function CreateReceiptPage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Create Receipt</h2>
                <p className="text-muted-foreground">
                    Create a new receipt for a client.
                </p>
            </div>
            <ReceiptForm merchantId={merchantId} />
        </div>
    );
}
