"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Invoice, Client, Merchant } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, AlertCircle } from "lucide-react";

export default function PaymentInvoicePage() {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params.invoiceId as string;
    const { getInvoiceById, clients, merchants } = useAppStore();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [client, setClient] = useState<Client | undefined>(undefined);
    const [merchant, setMerchant] = useState<Merchant | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const inv = getInvoiceById(invoiceId);
        if (inv) {
            setInvoice(inv);
            setClient(clients.find(c => c.id === inv.clientId));
            setMerchant(merchants.find(m => m.id === inv.merchantId));

            if (inv.status === 'paid') {
                router.replace(`/payment/${invoiceId}/complete`);
            }
        } else {
            setError("Invoice not found.");
        }
        setLoading(false);
    }, [invoiceId, getInvoiceById, clients, merchants, router]);

    if (loading) {
        return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error || !invoice) {
        return (
            <Card className="border-destructive/50">
                <CardContent className="pt-6 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
                    <p className="text-muted-foreground">{error || "Invoice not found"}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Payment Request</h1>
                <p className="text-gray-500">Please review the invoice details below</p>
            </div>

            <Card>
                <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Billed To</p>
                            <h3 className="text-lg font-bold">{client?.name || "Unknown Client"}</h3>
                            <p className="text-sm text-muted-foreground">{client?.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">From</p>
                            <h3 className="text-lg font-bold">{merchant?.name || "Unknown Merchant"}</h3>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Invoice Number</p>
                            <p className="font-medium">{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Due Date</p>
                            <p className="font-medium">{invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'N/A'}</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        {invoice.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(item.amount)}</span>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-6">
                    <Button
                        className="w-full text-lg py-6"
                        onClick={() => router.push(`/payment/${invoiceId}/credit-card`)}
                    >
                        Proceed to Payment
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
