"use client";

import { useAppStore } from "@/lib/store";
import { InvoiceForm } from "../invoice-form";

export default function CreateInvoicePage() {
    const { currentUser } = useAppStore();

    if (!currentUser) return <div>Loading...</div>;

    const merchantId = currentUser.merchantId || currentUser.id;

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Create Invoice</h2>
                    <p className="text-muted-foreground">
                        Create a new invoice for your client.
                    </p>
                </div>
            </div>
            <div className="max-w-4xl">
                <InvoiceForm merchantId={merchantId} />
            </div>
        </div>
    );
}
