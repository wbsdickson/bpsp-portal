"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { ArrowLeft, Calendar, CheckCircle2, Clock, Edit, FileText, User, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InvoiceAutoSetting } from "@/lib/types";

export default function InvoiceAutoSettingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { getMerchantInvoiceAutoSettings, getMerchantClients, getMerchantInvoiceTemplates, currentUser } = useAppStore();
    const [setting, setSetting] = useState<InvoiceAutoSetting | null>(null);
    const [clientName, setClientName] = useState("");
    const [templateName, setTemplateName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser && params.id) {
            const merchantId = currentUser.merchantId || currentUser.id;
            const settings = getMerchantInvoiceAutoSettings(merchantId);
            const found = settings.find(s => s.id === params.id);

            if (found) {
                setSetting(found);

                const clients = getMerchantClients(merchantId);
                const client = clients.find(c => c.id === found.clientId);
                setClientName(client ? client.name : "Unknown Client");

                const templates = getMerchantInvoiceTemplates(merchantId);
                const template = templates.find(t => t.id === found.templateId);
                setTemplateName(template ? template.name : "Unknown Template");
            } else {
                router.push("/dashboard/merchant/invoice-auto");
            }
            setLoading(false);
        }
    }, [params.id, getMerchantInvoiceAutoSettings, getMerchantClients, getMerchantInvoiceTemplates, router, currentUser]);

    if (!currentUser || loading) return <div>Loading...</div>;
    if (!setting) return <div>Schedule not found</div>; return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{setting.scheduleName}</h2>
                        <p className="text-muted-foreground">
                            Schedule Details
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" asChild>
                        <Link href={`/dashboard/merchant/invoice-auto/${setting.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Schedule
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Current settings for this auto-issuance schedule</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground mb-1">
                                    <User className="mr-2 h-4 w-4" />
                                    Target Client
                                </div>
                                <div className="font-medium">{clientName}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground mb-1">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Invoice Template
                                </div>
                                <div className="font-medium">{templateName}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground mb-1">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Frequency
                                </div>
                                <div className="font-medium capitalize">
                                    Every {setting.intervalValue} {setting.intervalType}(s)
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground mb-1">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Next Issuance
                                </div>
                                <div className="font-medium">
                                    {format(new Date(setting.nextIssuanceDate), "PPP")}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground mb-1">Start Date</div>
                                <div className="font-medium">
                                    {setting.startDate ? format(new Date(setting.startDate), "PPP") : "Not set"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground mb-1">End Date</div>
                                <div className="font-medium">
                                    {setting.endDate ? format(new Date(setting.endDate), "PPP") : "No end date"}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Current Status</span>
                            {setting.enabled ? (
                                <Badge className="bg-green-500 hover:bg-green-600">
                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                                </Badge>
                            ) : (
                                <Badge variant="secondary">
                                    <XCircle className="mr-1 h-3 w-3" /> Paused
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-2">
                            <span className="text-sm font-medium">Recent Activity</span>
                            <div className="text-sm text-muted-foreground border rounded-md p-3 bg-muted/50">
                                No invoices have been generated by this schedule yet.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
