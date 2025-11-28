"use client";

import { useAppStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AutoIssuanceForm } from "../../auto-issuance-form";

export default function EditAutoIssuancePage() {
    const params = useParams();
    const router = useRouter();
    const { getMerchantInvoiceAutoSettings } = useAppStore();
    const [setting, setSetting] = useState<any>(null);
    const merchantId = "u1";

    useEffect(() => {
        if (params.id) {
            const settings = getMerchantInvoiceAutoSettings(merchantId);
            const found = settings.find((s) => s.id === params.id);
            if (found) {
                setSetting(found);
            } else {
                router.push("/dashboard/merchant/simple-invoice-auto");
            }
        }
    }, [params.id, getMerchantInvoiceAutoSettings, router]);

    if (!setting) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Edit Schedule</h3>
                <p className="text-sm text-muted-foreground">
                    Update existing automated invoice issuance schedule.
                </p>
            </div>
            <div className="max-w-2xl">
                <AutoIssuanceForm
                    merchantId={merchantId}
                    setting={setting}
                />
            </div>
        </div>
    );
}
