"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { PurchaseOrder, PurchaseOrderStatus } from "@/lib/types";
import { Edit, Eye, Plus, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deletePurchaseOrderAction } from "./actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PurchaseOrderListProps {
    merchantId: string;
}

export function PurchaseOrderList({ merchantId }: PurchaseOrderListProps) {
    const { getMerchantPurchaseOrders, getMerchantClients, deletePurchaseOrder } = useAppStore();
    const purchaseOrders = getMerchantPurchaseOrders(merchantId);
    const clients = getMerchantClients(merchantId);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.name || "Unknown Client";
    };

    const filteredPurchaseOrders = purchaseOrders.filter(po => {
        const matchesSearch =
            po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getClientName(po.clientId).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || po.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            const formData = new FormData();
            formData.append("id", id);
            const result = await deletePurchaseOrderAction(null, formData);

            if (result.success) {
                deletePurchaseOrder(id);
                toast.success("Purchase Order deleted successfully");
            } else {
                toast.error(result.message || "Failed to delete purchase order");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    const getStatusBadge = (status: PurchaseOrderStatus) => {
        switch (status) {
            case "draft": return <Badge variant="secondary">Draft</Badge>;
            case "issued": return <Badge variant="default" className="bg-blue-500">Issued</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search purchase orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-[250px]"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="issued">Issued</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Link href="/dashboard/merchant/purchase-orders/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create PO
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Number</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPurchaseOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No purchase orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPurchaseOrders.map((po) => (
                                <TableRow key={po.id}>
                                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                                    <TableCell>{new Date(po.poDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{getClientName(po.clientId)}</TableCell>
                                    <TableCell>${po.amount.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(po.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link href={`/dashboard/merchant/purchase-orders/${po.id}`}>
                                                <Button variant="ghost" size="icon" title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/dashboard/merchant/purchase-orders/${po.id}/edit`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-red-500" title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the purchase order.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(po.id)}
                                                            className="bg-red-500 hover:bg-red-600"
                                                        >
                                                            {isDeleting === po.id ? "Deleting..." : "Delete"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
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
