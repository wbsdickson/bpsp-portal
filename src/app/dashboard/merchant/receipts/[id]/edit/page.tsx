"use client";

import { useAppStore } from "@/lib/store";
import { ReceiptForm } from "../../receipt-form";
import { useParams } from "next/navigation";

export default function EditReceiptPage() {
    const params = useParams();
    const id = params.id as string;
    const { currentUser, receipts } = useAppStore();
    const merchantId = currentUser?.merchantId || currentUser?.id || "";

    const receipt = receipts.find(rc => rc.id === id);

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    if (!receipt) {
        return <div>Receipt not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Edit Receipt</h2>
                <p className="text-muted-foreground">
                    Update receipt details.
                </p>
            </div>
            <ReceiptForm merchantId={merchantId} initialData={receipt} />
        </div>
    );
}
