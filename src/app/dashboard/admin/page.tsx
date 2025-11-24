'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
    const { getAllPayments, users } = useAppStore();

    const payments = getAllPayments();
    const totalVolume = payments.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalFees = payments.reduce((acc, curr) => acc + curr.fee, 0);
    const activeMerchants = users.filter(u => u.role === 'merchant').length;
    const pendingApprovals = payments.filter(p => p.status === 'pending_approval').length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard / 管理者ダッシュボード</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Processed across all merchants</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${totalFees.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total fees collected</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeMerchants}</div>
                        <p className="text-xs text-muted-foreground">Onboarded tenants</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pendingApprovals}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {payments.slice(0, 10).map((payment) => (
                            <div key={payment.id} className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Payment {payment.id} - {payment.status}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    +${payment.fee.toLocaleString()} (Fee)
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
