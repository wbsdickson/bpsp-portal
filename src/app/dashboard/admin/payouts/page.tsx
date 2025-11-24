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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PayoutsPage() {
    const { getAllPayments, approvePayment } = useAppStore();
    const payments = getAllPayments();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'settled': return 'bg-green-500';
            case 'pending_approval': return 'bg-yellow-500';
            case 'failed': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const PaymentTable = ({ data, showActions = false }: { data: typeof payments, showActions?: boolean }) => (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Net Payout</TableHead>
                        <TableHead>Status</TableHead>
                        {showActions && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                            <TableCell>{format(new Date(payment.createdAt), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>${payment.totalAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-green-600">+${payment.fee.toLocaleString()}</TableCell>
                            <TableCell className="font-bold">${payment.amount.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge className={getStatusColor(payment.status)} variant="secondary">
                                    {payment.status.replace('_', ' ')}
                                </Badge>
                            </TableCell>
                            {showActions && (
                                <TableCell className="text-right space-x-2">
                                    {payment.status === 'pending_approval' && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => {
                                                    approvePayment(payment.id);
                                                    toast.success(`Payment ${payment.id} approved successfully`);
                                                }}
                                            >
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => toast.error("Reject functionality not implemented in demo")}
                                            >
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={showActions ? 7 : 6} className="text-center py-8 text-muted-foreground">
                                No payments found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    const pendingPayments = payments.filter(p => p.status === 'pending_approval');
    const settledPayments = payments.filter(p => p.status === 'settled');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Payment Management / 支払い管理</h1>
                <Button variant="outline">Export Report</Button>
            </div>

            <Tabs defaultValue="approvals" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="approvals">
                        Approvals
                        {pendingPayments.length > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                                {pendingPayments.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="settled">Settled</TabsTrigger>
                    <TabsTrigger value="all">All Transactions</TabsTrigger>
                </TabsList>

                <TabsContent value="approvals">
                    <PaymentTable data={pendingPayments} showActions={true} />
                </TabsContent>

                <TabsContent value="settled">
                    <PaymentTable data={settledPayments} />
                </TabsContent>

                <TabsContent value="all">
                    <PaymentTable data={payments} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
