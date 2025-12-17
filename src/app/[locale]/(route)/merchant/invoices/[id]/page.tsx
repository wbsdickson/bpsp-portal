"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InvoiceDetailsPage() {
    const { currentUser, getMerchantInvoices, getMerchantClients } = useAppStore();
    const params = useParams();
    const id = params.id as string;

    if (!currentUser) return <div>Loading...</div>;

    const merchantId = currentUser.merchantId || currentUser.id;
    const invoices = getMerchantInvoices(merchantId);
    const invoice = invoices.find(i => i.id === id);
    const clients = getMerchantClients(merchantId);

    if (!invoice) {
        return <div>Invoice not found</div>;
    }

    const client = clients.find(c => c.id === invoice.clientId);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-500">Paid</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500">Pending</Badge>;
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            case 'void':
                return <Badge variant="outline">Void</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/merchant/invoices">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h2>
                        <p className="text-muted-foreground">
                            View invoice details.
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    {currentUser.memberRole !== 'viewer' && (
                        <Button asChild>
                            <Link href={`/dashboard/merchant/invoices/${invoice.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Invoice Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(item.unitPrice)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(item.quantity * item.unitPrice)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                                    <TableCell className="text-right font-bold">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Status</div>
                                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
                            </div>
                            <Separator />
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Invoice Date</div>
                                <div className="mt-1">{format(new Date(invoice.invoiceDate), "PPP")}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Due Date</div>
                                <div className="mt-1">
                                    {invoice.dueDate ? format(new Date(invoice.dueDate), "PPP") : "-"}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Client</div>
                                <div className="mt-1 font-medium">{client?.name || "Unknown Client"}</div>
                                <div className="text-sm text-muted-foreground">{client?.email}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {invoice.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
