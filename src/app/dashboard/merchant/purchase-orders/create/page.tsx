"use client";

import { useAppStore } from "@/lib/store";
import { PurchaseOrderForm } from "../purchase-order-form";

export default function CreatePurchaseOrderPage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Create Purchase Order</h2>
                <p className="text-muted-foreground">
                    Create a new purchase order for a client.
                </p>
            </div>
            <PurchaseOrderForm merchantId={merchantId} />
        </div>
    );
}
