'use client';

import { useAppStore } from '@/lib/store';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PaginationControls } from '@/components/ui/pagination-controls';

export default function HistoryPage() {
    const { currentUser, getMerchantPayments, cancelPayment } = useAppStore();
    const merchantId = currentUser?.merchantId || currentUser?.id || "";

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    if (!currentUser) return <div>Loading...</div>;

    const filteredPayments = getMerchantPayments(merchantId).filter(p => {
        const matchesSearch = p.id.toLowerCase().includes(search.toLowerCase()) ||
            p.paymentMethod.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

    const handleCancel = (id: string) => {
        if (confirm('Are you sure you want to cancel this payment?')) {
            cancelPayment(id);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Manage Payments / 履歴</h1>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search transaction ID or method..."
                    className="max-w-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="settled">Settled</SelectItem>
                        <SelectItem value="pending_approval">Pending Approval</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPayments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                                <TableCell>{format(new Date(payment.createdAt), 'MMM dd, yyyy')}</TableCell>
                                <TableCell className="font-mono text-xs">{payment.invoiceId}</TableCell>
                                <TableCell>{payment.paymentMethod}</TableCell>
                                <TableCell>${payment.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={payment.status === 'settled' ? 'default' : payment.status === 'failed' ? 'destructive' : 'secondary'}>
                                        {payment.status.replace(/_/g, ' ').toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {payment.status === 'pending_approval' && (
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => handleCancel(payment.id)}
                                            title="Cancel payment"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedPayments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredPayments.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                }}
            />
        </div>
    );
}
