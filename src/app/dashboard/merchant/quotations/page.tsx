"use client";

import { useAppStore } from "@/lib/store";
import { QuotationList } from "./quotation-list";

export default function QuotationsPage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Quotations</h2>
                <p className="text-muted-foreground">
                    Manage your quotations and estimates.
                </p>
            </div>
            <QuotationList merchantId={merchantId} />
        </div>
    );
}