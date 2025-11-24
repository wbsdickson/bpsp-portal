'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function MerchantDashboard() {
    const { currentUser, getMerchantInvoices, getMerchantPayments } = useAppStore();

    if (!currentUser) return <div>Loading...</div>;

    const invoices = getMerchantInvoices(currentUser.id);
    const payments = getMerchantPayments(currentUser.id);

    const totalSpend = payments.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const activeInvoices = invoices.filter(inv => inv.status === 'pending' || inv.status === 'approved').length;
    const pendingApprovals = invoices.filter(inv => inv.status === 'pending').length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Merchant Dashboard / 加盟店ダッシュボード</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSpend.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime transaction volume</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Invoices</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeInvoices}</div>
                        <p className="text-xs text-muted-foreground">Invoices needing attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingApprovals}</div>
                        <p className="text-xs text-muted-foreground">Waiting for approval</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {payments.slice(0, 5).map((payment) => (
                                <div key={payment.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Invoice #{payment.invoiceId}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        -${payment.totalAmount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {payments.length === 0 && (
                                <p className="text-sm text-muted-foreground">No recent payments found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {invoices.slice(0, 5).map((invoice) => (
                                <div key={invoice.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{invoice.recipientName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Due {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        ${invoice.amount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {invoices.length === 0 && (
                                <p className="text-sm text-muted-foreground">No invoices found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
