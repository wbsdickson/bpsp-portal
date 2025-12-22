"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ReceiptDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { receipts, getMerchantClients, currentUser } = useAppStore();
    const receipt = receipts.find(rc => rc.id === id);
    const merchantId = currentUser?.merchantId || currentUser?.id || "";
    const clients = getMerchantClients(merchantId);
    const client = receipt ? clients.find(c => c.id === receipt.clientId) : null;

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    if (!receipt) {
        return <div>Receipt not found</div>;
    }

    const subtotal = receipt.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = receipt.items.reduce((sum, item) => sum + (item.amount - (item.quantity * item.unitPrice)), 0);
    const totalAmount = receipt.amount;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'issued':
                return <Badge className="bg-green-500">Issued</Badge>;
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/merchant/receipts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Receipt Details</h2>
                        <p className="text-muted-foreground">
                            {receipt.receiptNumber}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    {receipt.status === 'draft' && currentUser.memberRole !== 'viewer' && (
                        <Link href={`/dashboard/merchant/receipts/${receipt.id}/edit`}>
                            <Button>Edit Receipt</Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Receipt Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Status</span>
                                <div className="mt-1">{getStatusBadge(receipt.status)}</div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Issue Date</span>
                                <div className="mt-1">{format(new Date(receipt.issueDate), "PPP")}</div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Customer Name</span>
                                <div className="mt-1">{client?.name || "-"}</div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Customer Email</span>
                                <div className="mt-1">{client?.email || "-"}</div>
                            </div>
                        </div>
                        {receipt.notes && (
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Notes</span>
                                <div className="mt-1 text-sm">{receipt.notes}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Currency</span>
                                <div className="mt-1 uppercase">{receipt.currency}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Quantity</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Unit Price</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {receipt.items.map((item) => (
                                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">{item.name}</td>
                                        <td className="p-4 align-middle text-right">{item.quantity}</td>
                                        <td className="p-4 align-middle text-right">${item.unitPrice.toFixed(2)}</td>
                                        <td className="p-4 align-middle text-right">${item.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-end">
                        <div className="w-1/3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
