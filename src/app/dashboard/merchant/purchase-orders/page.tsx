"use client";

import { useAppStore } from "@/lib/store";
import { PurchaseOrderList } from "./purchase-order-list";

export default function PurchaseOrdersPage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Purchase Orders</h2>
                <p className="text-muted-foreground">
                    Manage your purchase orders.
                </p>
            </div>
            <PurchaseOrderList merchantId={merchantId} />
        </div>
    );
}
