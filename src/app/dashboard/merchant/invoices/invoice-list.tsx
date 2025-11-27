"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { Invoice } from "@/lib/types";
import { format } from "date-fns";
import { Edit, Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteInvoiceAction } from "./actions";

interface InvoiceListProps {
    merchantId: string;
}

export function InvoiceList({ merchantId }: InvoiceListProps) {
    const router = useRouter();
    const { getMerchantInvoices, getMerchantClients, deleteInvoice } = useAppStore();
    const invoices = getMerchantInvoices(merchantId);
    const clients = getMerchantClients(merchantId);

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.name || "Unknown Client";
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this invoice?")) return;

        const formData = new FormData();
        formData.append("id", id);

        try {
            const result = await deleteInvoiceAction({}, formData);
            if (result.success) {
                deleteInvoice(id);
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to delete invoice");
        }
    };

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
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
                <Button asChild>
                    <Link href="/dashboard/merchant/invoices/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Invoice
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No invoices found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{getClientName(invoice.clientId)}</TableCell>
                                    <TableCell>{format(new Date(invoice.invoiceDate), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        {invoice.dueDate ? format(new Date(invoice.dueDate), "MMM d, yyyy") : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`/dashboard/merchant/invoices/${invoice.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/dashboard/merchant/invoices/${invoice.id}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(invoice.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
