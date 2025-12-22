"use client";

import { useAppStore } from "@/lib/store";
import { AutoIssuanceForm } from "../auto-issuance-form";

export default function CreateAutoIssuancePage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.merchantId || currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Schedule</h3>
                <p className="text-sm text-muted-foreground">
                    Set up a new automated invoice issuance schedule.
                </p>
            </div>
            <div className="max-w-2xl">
                <AutoIssuanceForm merchantId={merchantId} />
            </div>
        </div>
    );
}
