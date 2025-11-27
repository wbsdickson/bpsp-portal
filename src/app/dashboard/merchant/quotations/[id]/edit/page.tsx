"use client";

import { useAppStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { QuotationForm } from "../../quotation-form";

export default function EditQuotationPage() {
    const params = useParams();
    const id = params.id as string;
    const { quotations, currentUser } = useAppStore();
    const quotation = quotations.find(q => q.id === id);
    const merchantId = currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    if (!quotation) {
        return <div>Quotation not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Edit Quotation</h2>
                <p className="text-muted-foreground">
                    Update quotation details.
                </p>
            </div>
            <QuotationForm quotation={quotation} merchantId={merchantId} />
        </div>
    );
}
