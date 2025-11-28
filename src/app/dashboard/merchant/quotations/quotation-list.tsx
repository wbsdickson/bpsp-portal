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
import { Quotation, QuotationStatus } from "@/lib/types";
import { Edit, Eye, Plus, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deleteQuotationAction } from "./actions";
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

interface QuotationListProps {
    merchantId: string;
}

export function QuotationList({ merchantId }: QuotationListProps) {
    const { getMerchantQuotations, getMerchantClients, deleteQuotation, currentUser } = useAppStore();
    const quotations = getMerchantQuotations(merchantId);
    const clients = getMerchantClients(merchantId);

    const isViewer = currentUser?.memberRole === 'viewer';

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.name || "Unknown Client";
    };

    const filteredQuotations = quotations.filter(q => {
        const matchesSearch =
            q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getClientName(q.clientId).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            const formData = new FormData();
            formData.append("id", id);
            const result = await deleteQuotationAction(null, formData);

            if (result.success) {
                deleteQuotation(id);
                toast.success("Quotation deleted successfully");
            } else {
                toast.error(result.message || "Failed to delete quotation");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    const getStatusBadge = (status: QuotationStatus) => {
        switch (status) {
            case "draft": return <Badge variant="secondary">Draft</Badge>;
            case "sent": return <Badge variant="default" className="bg-blue-500">Sent</Badge>;
            case "accepted": return <Badge variant="default" className="bg-green-500">Accepted</Badge>;
            case "rejected": return <Badge variant="destructive">Rejected</Badge>;
            case "expired": return <Badge variant="outline" className="text-gray-500">Expired</Badge>;
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
                            placeholder="Search quotations..."
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
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {!isViewer && (
                    <Link href="/dashboard/merchant/quotations/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Quotation
                        </Button>
                    </Link>
                )}
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
                        {filteredQuotations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No quotations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredQuotations.map((quotation) => (
                                <TableRow key={quotation.id}>
                                    <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                                    <TableCell>{new Date(quotation.quotationDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{getClientName(quotation.clientId)}</TableCell>
                                    <TableCell>${quotation.amount.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link href={`/dashboard/merchant/quotations/${quotation.id}`}>
                                                <Button variant="ghost" size="icon" title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {!isViewer && (
                                                <>
                                                    <Link href={`/dashboard/merchant/quotations/${quotation.id}/edit`}>
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
                                                                    This action cannot be undone. This will permanently delete the quotation.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(quotation.id)}
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                >
                                                                    {isDeleting === quotation.id ? "Deleting..." : "Delete"}
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
        </div>
    );
}
