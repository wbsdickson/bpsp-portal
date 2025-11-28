"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Invoice, Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function PaymentCompletePage() {
    const params = useParams();
    const invoiceId = params.invoiceId as string;
    const { getInvoiceById, getTransactionByInvoiceId } = useAppStore();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const inv = getInvoiceById(invoiceId);
        const txn = getTransactionByInvoiceId(invoiceId);

        if (inv) setInvoice(inv);
        if (txn) setTransaction(txn);

        setLoading(false);
    }, [invoiceId, getInvoiceById, getTransactionByInvoiceId]);

    if (loading) {
        return <div className="flex justify-center py-12">Loading...</div>;
    }

    if (!invoice || !transaction) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-destructive">決済情報が確認できません。 (Payment information could not be found.)</h2>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="text-center border-green-200 bg-green-50/30">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-800">Payment Successful</CardTitle>
                    <p className="text-green-700">Thank you for your payment</p>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-muted-foreground">Invoice Number</div>
                        <div className="font-medium text-right">{invoice.invoiceNumber}</div>

                        <div className="text-muted-foreground">Amount Paid</div>
                        <div className="font-medium text-right">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(transaction.amount)}
                        </div>

                        <div className="text-muted-foreground">Payment Date</div>
                        <div className="font-medium text-right">
                            {format(new Date(transaction.createdAt), 'MMM d, yyyy HH:mm')}
                        </div>

                        <div className="text-muted-foreground">Transaction ID</div>
                        <div className="font-medium text-right font-mono text-xs">{transaction.id}</div>

                        <div className="text-muted-foreground">Payment Method</div>
                        <div className="font-medium text-right">{transaction.paymentMethod}</div>
                    </div>

                    <div className="pt-6 flex gap-3">
                        <Button variant="outline" className="flex-1" disabled>
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
