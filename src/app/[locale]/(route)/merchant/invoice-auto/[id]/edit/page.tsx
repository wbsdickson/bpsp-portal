"use client";

import { useAppStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AutoIssuanceForm } from "../../auto-issuance-form";
import { InvoiceAutoSetting } from "@/lib/types";

export default function EditInvoiceAutoSettingPage() {
    const params = useParams();
    const router = useRouter();
    const { getMerchantInvoiceAutoSettings, currentUser } = useAppStore();
    const [setting, setSetting] = useState<InvoiceAutoSetting | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser && params.id) {
            const merchantId = currentUser.merchantId || currentUser.id;
            const settings = getMerchantInvoiceAutoSettings(merchantId);
            const found = settings.find(s => s.id === params.id);
            if (found) {
                setSetting(found);
            } else {
                // Handle not found
                router.push("/dashboard/merchant/invoice-auto");
            }
            setLoading(false);
        }
    }, [params.id, getMerchantInvoiceAutoSettings, router, currentUser]);

    if (!currentUser || loading) {
        return <div>Loading...</div>;
    }

    if (!setting) {
        return <div>Schedule not found</div>;
    }

    const merchantId = currentUser.merchantId || currentUser.id;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Edit Auto-Issuance Schedule</h3>
                <p className="text-sm text-muted-foreground">
                    Update the settings for this auto-issuance schedule.
                </p>
            </div>
            <AutoIssuanceForm merchantId={merchantId} setting={setting} />
        </div>
    );
}
