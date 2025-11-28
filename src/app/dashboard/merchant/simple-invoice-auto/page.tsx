import { AutoIssuanceList } from "./auto-issuance-list";

export default function AutoIssuancePage() {
    // In a real app, we would get the merchant ID from the session
    const merchantId = "u1";

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
