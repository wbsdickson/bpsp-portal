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
import { ArrowLeft, Edit, Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PurchaseOrderDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { purchaseOrders, getMerchantClients, taxes, currentUser } = useAppStore();
    const purchaseOrder = purchaseOrders.find(po => po.id === id);
    const merchantId = currentUser?.merchantId || currentUser?.id || "";

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    if (!purchaseOrder) {
        return <div>Purchase Order not found</div>;
    }

    const client = getMerchantClients(merchantId).find(c => c.id === purchaseOrder.clientId);

    const getTaxName = (taxId: string) => {
        return taxes.find(t => t.id === taxId)?.name || "Unknown Tax";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/merchant/purchase-orders">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{purchaseOrder.poNumber}</h2>
                        <p className="text-muted-foreground">
                            Created on {new Date(purchaseOrder.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    {currentUser.memberRole !== 'viewer' && (
                        <Link href={`/dashboard/merchant/purchase-orders/${purchaseOrder.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Purchase Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-1">Client</h3>
                                <p>{client?.name}</p>
                                <p className="text-sm text-muted-foreground">{client?.email}</p>
                                <p className="text-sm text-muted-foreground">{client?.address}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold mb-1">Status</h3>
                                <Badge variant="outline" className="capitalize">{purchaseOrder.status}</Badge>
                                <h3 className="font-semibold mt-4 mb-1">Date</h3>
                                <p>{new Date(purchaseOrder.poDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <Separator />

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Tax</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchaseOrder.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${item.unitPrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{getTaxName(item.taxId)}</TableCell>
                                        <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex justify-end">
                            <div className="w-1/3 space-y-2">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${purchaseOrder.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {purchaseOrder.notes && (
                            <div className="bg-muted p-4 rounded-md">
                                <h4 className="font-semibold mb-2">Notes</h4>
                                <p className="text-sm">{purchaseOrder.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>Created on {new Date(purchaseOrder.createdAt).toLocaleDateString()}</span>
                            </div>
                            {/* Add more history items here if available */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
