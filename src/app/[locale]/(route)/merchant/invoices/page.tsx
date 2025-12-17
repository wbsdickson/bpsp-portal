"use client";

import { useAppStore } from "@/lib/store";
import { InvoiceList } from "./invoice-list";

export default function InvoicesPage() {
    const { currentUser } = useAppStore();

    if (!currentUser) return <div>Loading...</div>;

    const merchantId = currentUser.merchantId || currentUser.id;

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Invoice Management</h2>
                    <p className="text-muted-foreground">
                        Create, view, and manage your invoices.
                    </p>
                </div>
            </div>

            <InvoiceList merchantId={merchantId} />
        </div>
    );
}

