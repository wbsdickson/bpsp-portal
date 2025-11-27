"use client";

import { AutoIssuanceForm } from "../auto-issuance-form";
import { useAppStore } from "@/lib/store";

export default function CreateInvoiceAutoSettingPage() {
    const { currentUser } = useAppStore();

    if (!currentUser) return <div>Loading...</div>;

    const merchantId = currentUser.merchantId || currentUser.id;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Auto-Issuance Schedule</h3>
                <p className="text-sm text-muted-foreground">
                    Set up a new automatic invoice issuance schedule.
                </p>
            </div>
            <AutoIssuanceForm merchantId={merchantId} />
        </div>
    );
}
