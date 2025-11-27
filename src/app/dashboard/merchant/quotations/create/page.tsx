"use client";

import { useAppStore } from "@/lib/store";
import { QuotationForm } from "../quotation-form";

export default function CreateQuotationPage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Create Quotation</h2>
                <p className="text-muted-foreground">
                    Create a new quotation for a client.
                </p>
            </div>
            <QuotationForm merchantId={merchantId} />
        </div>
    );
}
