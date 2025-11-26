'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, FileText, CreditCard, Bell, AlertCircle } from 'lucide-react';
import { format, isSameMonth, parseISO } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Function ID: MERCHANT_004
 * Function Name: Dashboard
 * Category: Screen Function (SSR)
 * Objective: To allow merchants to view an overview of their sales and payment transaction status and confirm their current business performance.
 */
export default function MerchantDashboard() {
    const { currentUser, getMerchantInvoices, getMerchantPayments, getMerchantNotifications } = useAppStore();

    if (!currentUser) return <div>Loading...</div>;

    const invoices = getMerchantInvoices(currentUser.id);
    const payments = getMerchantPayments(currentUser.id);
    const notifications = getMerchantNotifications(currentUser.id);

    const now = new Date();

    // 1. Number of invoices issued this month
    const invoicesThisMonth = invoices.filter(inv =>
        isSameMonth(parseISO(inv.createdAt), now)
    ).length;

    // 2. Total sales amount for the current month (tax included)
    // Interpreted as Total Transaction Volume (Payments) for the current month
    const salesThisMonth = payments
        .filter(pay => isSameMonth(parseISO(pay.createdAt), now))
        .reduce((acc, curr) => acc + curr.totalAmount, 0);

    // 3. Outstanding receivable amount
    // Interpreted as Outstanding Payables (Unpaid Invoices)
    const outstandingAmount = invoices
        .filter(inv => inv.status === 'pending' || inv.status === 'approved')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // 4. Amount paid
    // Total amount settled
    const amountPaid = payments
        .filter(pay => pay.status === 'settled')
        .reduce((acc, curr) => acc + curr.totalAmount, 0);

    // 5. Recent transactions (latest 10 entries)
    // Filter out failed transactions as per requirement "transaction.status != 'failed'"?
    // Requirement says: "Retrieve latest transactions（transaction.status != 'failed'）"
    const recentTransactions = payments
        .filter(pay => pay.status !== 'failed')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

    // 6. Latest notifications (latest 5 entries)
    const recentNotifications = notifications
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    if (invoices.length === 0 && payments.length === 0 && notifications.length === 0) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">No data available</h2>
                    <p className="text-muted-foreground">データがありません</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {currentUser.name}</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Invoices (This Month)</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{invoicesThisMonth}</div>
                        <p className="text-xs text-muted-foreground">Issued this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales (This Month)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${salesThisMonth.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total transaction volume</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${outstandingAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Pending & Approved invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${amountPaid.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total settled amount</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Transactions */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest 10 successful transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Invoice ID</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTransactions.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{format(parseISO(payment.createdAt), 'yyyy-MM-dd')}</TableCell>
                                        <TableCell>{payment.invoiceId}</TableCell>
                                        <TableCell>{payment.paymentMethod}</TableCell>
                                        <TableCell className="text-right">${payment.totalAmount.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={payment.status === 'settled' ? 'default' : 'secondary'}>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {recentTransactions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No recent transactions found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Latest 5 updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                {recentNotifications.map((notification) => (
                                    <div key={notification.id} className="flex items-start space-x-4 rounded-md border p-3">
                                        <Bell className={`mt-1 h-5 w-5 ${notification.type === 'error' ? 'text-red-500' :
                                                notification.type === 'warning' ? 'text-yellow-500' :
                                                    notification.type === 'success' ? 'text-green-500' :
                                                        'text-blue-500'
                                            }`} />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{notification.title}</p>
                                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground pt-1">
                                                {format(parseISO(notification.createdAt), 'yyyy-MM-dd HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {recentNotifications.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No notifications.
                                    </p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

