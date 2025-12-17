"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useParams, useRouter } from "next/navigation";

export default function DeliveryNoteDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { currentUser, deliveryNotes, getMerchantClients } = useAppStore();
    const merchantId = currentUser?.merchantId || currentUser?.id || "";

    const deliveryNote = deliveryNotes.find(dn => dn.id === id);
    const clients = getMerchantClients(merchantId);
    const client = deliveryNote ? clients.find(c => c.id === deliveryNote.clientId) : null;

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    if (!deliveryNote) {
        return <div>Delivery Note not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Delivery Note {deliveryNote.deliveryNoteNumber}</h2>
                        <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={deliveryNote.status === 'issued' ? 'default' : 'secondary'}>
                                {deliveryNote.status.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                Issued on {new Date(deliveryNote.deliveryDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    {currentUser.memberRole !== 'viewer' && (
                        <Link href={`/dashboard/merchant/delivery-notes/${id}/edit`}>
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
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deliveryNote.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-end mt-4">
                            <div className="w-1/3 space-y-2">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${deliveryNote.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {client ? (
                                <div className="space-y-2">
                                    <div className="font-medium">{client.name}</div>
                                    <div className="text-sm text-muted-foreground">{client.email}</div>
                                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">{client.address}</div>
                                </div>
                            ) : (
                                <div className="text-muted-foreground">Client information not available</div>
                            )}
                        </CardContent>
                    </Card>

                    {deliveryNote.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {deliveryNote.notes}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
