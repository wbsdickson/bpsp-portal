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
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function HistoryPage() {
    const { currentUser, getMerchantPayments, cancelPayment } = useAppStore();
    const [search, setSearch] = useState('');

    if (!currentUser) return <div>Loading...</div>;

    const payments = getMerchantPayments(currentUser.id).filter(p =>
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.paymentMethod.toLowerCase().includes(search.toLowerCase())
    );

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
                        {payments.map((payment) => (
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
                        {payments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
