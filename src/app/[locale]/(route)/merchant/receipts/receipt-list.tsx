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
import { Receipt, ReceiptStatus } from "@/lib/types";
import { Edit, Eye, Plus, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { deleteReceiptAction } from "./actions";
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
import { PaginationControls } from "@/components/ui/pagination-controls";

interface ReceiptListProps {
    merchantId: string;
}

export function ReceiptList({ merchantId }: ReceiptListProps) {
    const { getMerchantReceipts, getMerchantClients, deleteReceipt, currentUser } = useAppStore();
    const receipts = getMerchantReceipts(merchantId);
    const clients = getMerchantClients(merchantId);

    const isViewer = currentUser?.memberRole === 'viewer';

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.name || "Unknown Client";
    };

    const filteredReceipts = receipts.filter(rc => {
        const matchesSearch =
            rc.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getClientName(rc.clientId).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || rc.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedReceipts = filteredReceipts.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            const formData = new FormData();
            formData.append("id", id);
            const result = await deleteReceiptAction(null, formData);

            if (result.success) {
                deleteReceipt(id);
                toast.success("Receipt deleted successfully");
            } else {
                toast.error(result.message || "Failed to delete receipt");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    const getStatusBadge = (status: ReceiptStatus) => {
        switch (status) {
            case "draft": return <Badge variant="secondary">Draft</Badge>;
            case "issued": return <Badge variant="default" className="bg-green-500">Issued</Badge>;
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
                            placeholder="Search receipts..."
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
                {!isViewer && (
                    <Link href="/dashboard/merchant/receipts/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Receipt
                        </Button>
                    </Link>
                )}
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Number</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedReceipts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No receipts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedReceipts.map((rc) => (
                                <TableRow key={rc.id}>
                                    <TableCell className="font-medium">{rc.receiptNumber}</TableCell>
                                    <TableCell>{new Date(rc.issueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{getClientName(rc.clientId)}</TableCell>
                                    <TableCell>${rc.amount.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(rc.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link href={`/dashboard/merchant/receipts/${rc.id}`}>
                                                <Button variant="ghost" size="icon" title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {!isViewer && (
                                                <>
                                                    <Link href={`/dashboard/merchant/receipts/${rc.id}/edit`}>
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
                                                                    This action cannot be undone. This will permanently delete the receipt.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(rc.id)}
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                >
                                                                    {isDeleting === rc.id ? "Deleting..." : "Delete"}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredReceipts.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                }}
            />
        </div>
    );
}
