"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { FinanceList } from "./finance-list";

export default function FinancePage() {
    const { currentUser, getMerchantInvoices } = useAppStore();
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM

    if (!currentUser) return <div>Loading...</div>;

    const merchantId = currentUser.merchantId || currentUser.id;
    const invoices = getMerchantInvoices(merchantId);

    // Filter invoices by selected month
    const monthlyInvoices = invoices.filter(inv => inv.invoiceDate.startsWith(selectedMonth));

    // Calculate Summary Stats
    const totalBilled = monthlyInvoices
        .filter(inv => inv.direction === 'receivable' && inv.status !== 'void' && inv.status !== 'rejected')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const totalPayable = monthlyInvoices
        .filter(inv => inv.direction === 'payable' && inv.status !== 'void' && inv.status !== 'rejected')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const paidCount = monthlyInvoices.filter(inv => inv.status === 'paid').length;
    const unpaidCount = monthlyInvoices.filter(inv => ['pending', 'approved', 'draft'].includes(inv.status)).length;
    // Assuming 'paid' status implies settled for this summary
    const settledCount = paidCount;
    const unsettledCount = unpaidCount;

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Finance Management</h2>
                    <p className="text-muted-foreground">
                        Track your income, expenses, and cash flow.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }).map((_, i) => {
                                const date = new Date();
                                date.setMonth(date.getMonth() - i);
                                const value = date.toISOString().slice(0, 7);
                                const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                                return <SelectItem key={value} value={value}>{label}</SelectItem>;
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Billed (Receivable)</CardTitle>
                        <ArrowDownCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBilled)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Income for {selectedMonth}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Payable</CardTitle>
                        <ArrowUpCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPayable)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Expenses for {selectedMonth}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Paid:</span>
                            <span className="font-bold">{paidCount}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Unpaid:</span>
                            <span className="font-bold">{unpaidCount}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Settlement Status</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Settled:</span>
                            <span className="font-bold">{settledCount}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Unsettled:</span>
                            <span className="font-bold">{unsettledCount}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <FinanceList merchantId={merchantId} />
        </div>
    );
}
