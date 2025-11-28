"use client";

import { useAppStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { PurchaseOrderForm } from "../../purchase-order-form";

export default function EditPurchaseOrderPage() {
    const params = useParams();
    const id = params.id as string;
    const { purchaseOrders, currentUser } = useAppStore();
    const purchaseOrder = purchaseOrders.find(po => po.id === id);
    const merchantId = currentUser?.merchantId || currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    if (!purchaseOrder) {
        return <div>Purchase Order not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Edit Purchase Order</h2>
                <p className="text-muted-foreground">
                    Update purchase order details.
                </p>
            </div>
            <PurchaseOrderForm purchaseOrder={purchaseOrder} merchantId={merchantId} />
        </div>
    );
}
