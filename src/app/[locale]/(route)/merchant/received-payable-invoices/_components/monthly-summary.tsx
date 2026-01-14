"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReceivedInvoiceStore } from "@/store/merchant/received-invoice-store";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { Calendar, TrendingUp, TrendingDown, DollarSign, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

type MonthlySummaryData = {
  month: string;
  totalBilledAmount: number;
  totalPayableAmount: number;
  paidCount: number;
  unpaidCount: number;
  settledCount: number;
  unsettledCount: number;
  currency: string;
};

export default function MonthlySummary() {
  const t = useTranslations("Merchant.ReceivedPayableInvoices");
  const invoices = useReceivedInvoiceStore((s) => s.invoices);

  // Get current month as default
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const [selectedMonth, setSelectedMonth] = React.useState<string>(currentMonth);

  // Generate month options for the last 12 months
  const monthOptions = React.useMemo(() => {
    const options = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
      options.push({ value: monthKey, label: monthLabel });
    }

    return options;
  }, []);

  // Calculate monthly summary data
  const summaryData = React.useMemo<MonthlySummaryData>(() => {
    const filteredInvoices = invoices.filter((invoice) => {
      if (invoice.deletedAt) return false;
      const invoiceMonth = invoice.invoiceDate.substring(0, 7); // YYYY-MM format
      return invoiceMonth === selectedMonth;
    });

    const receivableInvoices = filteredInvoices.filter(inv => inv.direction === 'receivable');
    const payableInvoices = filteredInvoices.filter(inv => inv.direction === 'payable');

    const totalBilledAmount = receivableInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPayableAmount = payableInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const paidInvoices = filteredInvoices.filter(inv => inv.status === 'paid');
    const unpaidInvoices = filteredInvoices.filter(inv =>
      inv.status !== 'paid' && inv.status !== 'void' && inv.status !== 'rejected'
    );

    // For this example, settled means paid invoices, unsettled means pending/approved invoices
    const settledInvoices = paidInvoices;
    const unsettledInvoices = filteredInvoices.filter(inv =>
      inv.status === 'pending' || inv.status === 'approved'
    );

    // Use the most common currency or default to JPY
    const currencies = filteredInvoices.map(inv => inv.currency);
    const mostCommonCurrency = currencies.length > 0
      ? currencies.sort((a, b) =>
        currencies.filter(c => c === b).length - currencies.filter(c => c === a).length
      )[0]
      : 'JPY';

    return {
      month: selectedMonth,
      totalBilledAmount,
      totalPayableAmount,
      paidCount: paidInvoices.length,
      unpaidCount: unpaidInvoices.length,
      settledCount: settledInvoices.length,
      unsettledCount: unsettledInvoices.length,
      currency: mostCommonCurrency,
    };
  }, [invoices, selectedMonth]);

  const formatCurrency = (amount: number) => {
    return `${getCurrencySymbol(summaryData.currency)} ${formattedAmount(amount, summaryData.currency)}`;
  };

  return (
    <div className="space-y-6 p-4">
      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{t("summary.targetMonth")}</span>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Billed Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("summary.totalBilledAmount")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summaryData.totalBilledAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("summary.receivableInvoicesFor")} {monthOptions.find(m => m.value === selectedMonth)?.label}
            </p>
          </CardContent>
        </Card>

        {/* Total Payable Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("summary.totalPayableAmount")}</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summaryData.totalPayableAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("summary.payableInvoicesFor")} {monthOptions.find(m => m.value === selectedMonth)?.label}
            </p>
          </CardContent>
        </Card>

        {/* Paid Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("summary.paidCount")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.paidCount}</div>
            <p className="text-xs text-muted-foreground">
              {t("summary.invoicesMarkedAsPaid")}
            </p>
          </CardContent>
        </Card>

        {/* Unpaid Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("summary.unpaidCount")}</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.unpaidCount}</div>
            <p className="text-xs text-muted-foreground">
              {t("summary.invoicesPendingPayment")}
            </p>
          </CardContent>
        </Card>

        {/* Settled Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("settledCount")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.settledCount}</div>
            <p className="text-xs text-muted-foreground">
              {t("transactionsSettled")}
            </p>
          </CardContent>
        </Card>

        {/* Unsettled Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("unsettledCount")}</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.unsettledCount}</div>
            <p className="text-xs text-muted-foreground">
              {t("transactionsPendingSettlement")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("monthlyOverview")} - {monthOptions.find(m => m.value === selectedMonth)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">{t("incomeStatus")}</h4>
              <div className="flex items-center justify-between">
                <span>{t("totalBilled")}</span>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  {formatCurrency(summaryData.totalBilledAmount)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("paidInvoices")}</span>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                  {summaryData.paidCount} {t("invoices")}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">{t("paymentStatus")}</h4>
              <div className="flex items-center justify-between">
                <span>{t("totalPayable")}</span>
                <Badge variant="secondary" className="bg-red-50 text-red-700">
                  {formatCurrency(summaryData.totalPayableAmount)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("unpaidInvoices")}</span>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                  {summaryData.unpaidCount} {t("invoices")}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}