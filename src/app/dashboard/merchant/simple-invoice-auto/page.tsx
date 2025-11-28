"use client";

import { useAppStore } from "@/lib/store";
import { AutoIssuanceList } from "./auto-issuance-list";

export default function AutoIssuancePage() {
    const { currentUser } = useAppStore();
    const merchantId = currentUser?.merchantId || currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Auto-Issuance</h3>
                <p className="text-sm text-muted-foreground">
                    Manage automated invoice issuance schedules.
                </p>
            </div>
            <AutoIssuanceList merchantId={merchantId} />
        </div>
    );
}
