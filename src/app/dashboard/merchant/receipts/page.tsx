"use client";

import { useAppStore } from "@/lib/store";
import { ReceiptList } from "./receipt-list";

export default function ReceiptsPage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.merchantId || currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Receipts</h2>
                <p className="text-muted-foreground">
                    Manage your receipts.
                </p>
            </div>
            <ReceiptList merchantId={merchantId} />
        </div>
    );
}
