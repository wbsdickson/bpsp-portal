"use client";

import * as React from "react";

import HeaderPage from "@/components/header-page";
import DateRangePicker from "@/components/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { useTranslations } from "next-intl";

import { useMerchantStore } from "@/store/merchant-store";
import { useClientStore } from "@/store/client-store";
import { useSalesStore } from "@/store/sales-store";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export default function SalesPage() {
  const t = useTranslations("Operator.Sales");

  const merchants = useMerchantStore((s) => s.merchants);
  const clients = useClientStore((s) => s.clients);

  const merchantId = useSalesStore((s) => s.merchantId);
  const clientId = useSalesStore((s) => s.clientId);
  const period = useSalesStore((s) => s.period);

  const setMerchantId = useSalesStore((s) => s.setMerchantId);
  const setClientId = useSalesStore((s) => s.setClientId);
  const setPeriod = useSalesStore((s) => s.setPeriod);

  const getKpis = useSalesStore((s) => s.getKpis);
  const getDaily = useSalesStore((s) => s.getDailyAggregation);
  const getMonthly = useSalesStore((s) => s.getMonthlyAggregation);
  const getAnnual = useSalesStore((s) => s.getAnnualAggregation);

  React.useEffect(() => {
    if (merchantId) return;
    if (merchants[0]?.id) setMerchantId(merchants[0].id);
  }, [merchantId, merchants, setMerchantId]);

  const merchantClients = React.useMemo(() => {
    if (!merchantId) return [];
    return clients.filter((c) => c.merchantId === merchantId && !c.deletedAt);
  }, [clients, merchantId]);

  React.useEffect(() => {
    if (!merchantId) return;
    if (clientId) return;
    if (merchantClients[0]?.id) setClientId(merchantClients[0].id);
  }, [clientId, merchantClients, merchantId, setClientId]);

  const kpis = React.useMemo(
    () => getKpis(),
    [getKpis, merchantId, clientId, period],
  );
  const daily = React.useMemo(
    () => getDaily(),
    [getDaily, merchantId, clientId, period],
  );
  const monthly = React.useMemo(
    () => getMonthly(),
    [getMonthly, merchantId, clientId, period],
  );
  const annual = React.useMemo(
    () => getAnnual(),
    [getAnnual, merchantId, clientId, period],
  );

  const dailyChartData = React.useMemo(() => {
    return daily.map((d) => ({
      date: d.key,
      salesAmount: d.salesAmount,
      feeAmount: d.feeAmount,
      transactionCount: d.transactionCount,
    }));
  }, [daily]);

  const monthlyChartData = React.useMemo(() => {
    return monthly.map((m) => ({
      month: m.key,
      salesAmount: m.salesAmount,
      feeAmount: m.feeAmount,
      transactionCount: m.transactionCount,
    }));
  }, [monthly]);

  const annualChartData = React.useMemo(() => {
    return annual.map((y) => ({
      year: y.key,
      salesAmount: y.salesAmount,
      feeAmount: y.feeAmount,
      transactionCount: y.transactionCount,
    }));
  }, [annual]);

  return (
    <HeaderPage title={t("title")}>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("filters.title")}</CardTitle>
            <CardDescription>{t("filters.description")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("filters.period")}</div>
              <DateRangePicker
                className="h-9 w-full justify-between"
                initialDateFrom={period.from}
                initialDateTo={period.to}
                onUpdate={({ range }) => {
                  setPeriod({
                    from: range.from,
                    to: range.to ?? range.from,
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">{t("filters.merchant")}</div>
              <Select value={merchantId} onValueChange={setMerchantId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t("filters.selectMerchant")} />
                </SelectTrigger>
                <SelectContent>
                  {merchants.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">{t("filters.client")}</div>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t("filters.selectClient")} />
                </SelectTrigger>
                <SelectContent>
                  {merchantClients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t("kpis.salesAmount")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatMoney(kpis.salesAmount, kpis.currency)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t("kpis.feeAmount")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatMoney(kpis.feeAmount, kpis.currency)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {t("kpis.transactionCount")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {kpis.transactionCount}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">{t("charts.daily")}</CardTitle>
              <CardDescription>{t("charts.dailyDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              {dailyChartData.length === 0 ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  {t("charts.noData")}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyChartData}
                    margin={{ left: 8, right: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="salesAmount"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={false}
                      name={t("charts.sales")}
                    />
                    <Line
                      type="monotone"
                      dataKey="feeAmount"
                      stroke="#EC4899"
                      strokeWidth={2}
                      dot={false}
                      name={t("charts.fee")}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("charts.annual")}</CardTitle>
              <CardDescription>{t("charts.annualDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              {annualChartData.length === 0 ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  {t("charts.noData")}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={annualChartData}
                    margin={{ left: 8, right: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="salesAmount"
                      fill="#4F46E5"
                      radius={[6, 6, 0, 0]}
                      name={t("charts.sales")}
                    />
                    <Bar
                      dataKey="feeAmount"
                      fill="#EC4899"
                      radius={[6, 6, 0, 0]}
                      name={t("charts.fee")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("charts.monthly")}</CardTitle>
            <CardDescription>{t("charts.monthlyDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {monthlyChartData.length === 0 ? (
              <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                {t("charts.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyChartData}
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="salesAmount"
                    fill="#4F46E5"
                    radius={[6, 6, 0, 0]}
                    name={t("charts.sales")}
                  />
                  <Bar
                    dataKey="feeAmount"
                    fill="#EC4899"
                    radius={[6, 6, 0, 0]}
                    name={t("charts.fee")}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </HeaderPage>
  );
}
