"use client";

import { useAppStore } from "@/lib/store";
import { InvoiceForm } from "../../invoice-form";
import { useParams } from "next/navigation";

export default function EditInvoicePage() {
    const { currentUser, getMerchantInvoices } = useAppStore();
    const params = useParams();
    const id = params.id as string;

    if (!currentUser) return <div>Loading...</div>;

    const merchantId = currentUser.merchantId || currentUser.id;
    const invoices = getMerchantInvoices(merchantId);
    const invoice = invoices.find(i => i.id === id);

    if (!invoice) {
        return <div>Invoice not found</div>;
    }

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Invoice</h2>
                    <p className="text-muted-foreground">
                        Edit invoice details.
                    </p>
                </div>
            </div>
            <div className="max-w-4xl">
                <InvoiceForm merchantId={merchantId} invoice={invoice} />
            </div>
        </div>
    );
}
