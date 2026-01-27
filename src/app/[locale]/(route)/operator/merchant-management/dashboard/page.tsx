"use client";

import * as React from "react";

import HeaderPage from "@/components/header-page";
import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoiceStore } from "@/store/invoice-store";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useMerchantStore } from "@/store/merchant-store";
import { usePayoutTransactionStore } from "@/store/payout-transaction-store";
import type { AppMerchant, MerchantStatus } from "@/types/merchant";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  type TooltipItem,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
);

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

function formatDateTime(value?: string) {
  if (!value) return "—";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString();
}

function statusBadgeVariant(status?: MerchantStatus): BadgeVariant {
  const variantMap: Record<MerchantStatus, BadgeVariant> = {
    active: "success",
    suspended: "destructive",
  };
  return (status && variantMap[status]) || "secondary";
}

function getLatestTimestamp(values: Array<string | undefined | null>) {
  const times = values
    .filter((v): v is string => Boolean(v))
    .map((v) => new Date(v).getTime())
    .filter((t) => Number.isFinite(t));

  if (times.length === 0) return undefined;
  return new Date(Math.max(...times)).toISOString();
}

function toMonthKey(value?: string) {
  if (!value) return undefined;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return undefined;
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function kpiDeltaTone(delta: number) {
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "flat";
}

function KpiCard({
  title,
  value,
  delta,
  icon,
  iconBgClass,
}: {
  title: string;
  value: string;
  delta: number;
  icon: React.ReactNode;
  iconBgClass: string;
}) {
  const tone = kpiDeltaTone(delta);
  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex flex-1 items-start justify-between gap-3">
        <div className="flex flex-1 flex-col justify-between space-y-1">
          <div className="text-muted-foreground text-xs font-medium">
            {title}
          </div>
          <div className="text-xl font-semibold leading-none">{value}</div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            {tone === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            ) : tone === "down" ? (
              <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
            ) : null}
            <span
              className={
                tone === "up"
                  ? "text-emerald-600"
                  : tone === "down"
                    ? "text-rose-600"
                    : "text-muted-foreground"
              }
            >
              {tone === "flat"
                ? "No change"
                : `${tone === "up" ? "Increased" : "Decreased"} by ${Math.abs(
                    delta,
                  ).toFixed(2)}%`}
            </span>
          </div>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function MerchantManagementDashboardPage() {
  const t = useTranslations("Operator.MerchantManagementDashboard");

  const merchants = useMerchantStore((s) => s.merchants);
  const invoices = useInvoiceStore((s) => s.invoices);
  const fees = useMerchantFeeStore((s) => s.fees);
  const payoutTransactions = usePayoutTransactionStore((s) => s.transactions);

  const [merchantId, setMerchantId] = React.useState<string>(
    merchants[0]?.id ?? "",
  );

  React.useEffect(() => {
    if (merchantId) return;
    if (merchants[0]?.id) setMerchantId(merchants[0].id);
  }, [merchantId, merchants]);

  const selectedMerchant: AppMerchant | undefined = merchants.find(
    (m) => m.id === merchantId,
  );

  const summary = (() => {
    if (!merchantId) return undefined;

    const merchantInvoices = invoices.filter(
      (inv) => inv.merchantId === merchantId && !inv.deletedAt,
    );

    const transactionCount = merchantInvoices.length;
    const currency = merchantInvoices[0]?.currency ?? "JPY";
    const totalSales = merchantInvoices
      .filter((inv) => inv.direction === "receivable")
      .reduce((sum, inv) => sum + (inv.amount ?? 0), 0);

    const merchantFeeConfigs = fees.filter((f) => f.merchantId === merchantId);
    const totalFees = payoutTransactions
      .filter((p) => p.merchantId === merchantId)
      .reduce((sum, p) => sum + (p.fee ?? 0), 0);

    const pendingPayoutAmount = payoutTransactions
      .filter(
        (p) => p.merchantId === merchantId && p.status === "pending_approval",
      )
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);

    const latestInvoiceTs = getLatestTimestamp(
      merchantInvoices.flatMap((inv) => [inv.updatedAt, inv.createdAt]),
    );
    const latestPayoutTs = getLatestTimestamp(
      payoutTransactions
        .filter((p) => p.merchantId === merchantId)
        .flatMap((p) => [p.settledAt, p.createdAt]),
    );
    const latestFeeTs = getLatestTimestamp(
      merchantFeeConfigs.flatMap((f) => [f.updatedAt, f.createdAt]),
    );

    const lastUpdatedAt = getLatestTimestamp([
      selectedMerchant?.createdAt,
      latestInvoiceTs,
      latestPayoutTs,
      latestFeeTs,
    ]);

    return {
      currency,
      transactionCount,
      totalSales,
      totalFees,
      pendingPayoutAmount,
      lastUpdatedAt,
    };
  })();

  const chartData = (() => {
    if (!merchantId) {
      return {
        currency: "JPY",
        salesByMonth: [] as Array<{ month: string; sales: number }>,
        payoutByStatus: [] as Array<{ name: string; value: number }>,
      };
    }

    const currency =
      invoices.find((inv) => inv.merchantId === merchantId)?.currency ?? "JPY";

    const salesByMonthMap = invoices
      .filter(
        (inv) =>
          inv.merchantId === merchantId &&
          !inv.deletedAt &&
          inv.direction === "receivable",
      )
      .reduce<Record<string, number>>((acc, inv) => {
        const key = toMonthKey(inv.invoiceDate ?? inv.createdAt);
        if (!key) return acc;
        acc[key] = (acc[key] ?? 0) + (inv.amount ?? 0);
        return acc;
      }, {});

    const salesByMonth = Object.entries(salesByMonthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, sales]) => ({ month, sales }));

    const payoutByStatusMap = payoutTransactions
      .filter((p) => p.merchantId === merchantId)
      .reduce<Record<string, number>>((acc, p) => {
        const key = p.status ?? "unknown";
        acc[key] = (acc[key] ?? 0) + (p.amount ?? 0);
        return acc;
      }, {});

    const payoutByStatus = Object.entries(payoutByStatusMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { currency, salesByMonth, payoutByStatus };
  })();

  const salesLineData = {
    labels: chartData.salesByMonth.map((d) => d.month),
    datasets: [
      {
        label: t("charts.sales"),
        data: chartData.salesByMonth.map((d) => d.sales),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.15)",
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const salesLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"line">) =>
            formatMoney((ctx.parsed?.y ?? 0) as number, chartData.currency),
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (v: number | string) => String(v) } },
    },
  };

  const payoutColors = chartData.payoutByStatus.map((entry) => {
    if (entry.name === "settled") return "#16a34a";
    if (entry.name === "pending_approval") return "#f59e0b";
    if (entry.name === "failed") return "#dc2626";
    return "#64748b";
  });

  const payoutDoughnutData = {
    labels: chartData.payoutByStatus.map((d) => d.name),
    datasets: [
      {
        label: t("charts.payoutStatus"),
        data: chartData.payoutByStatus.map((d) => d.value),
        backgroundColor: payoutColors,
        borderWidth: 1,
      },
    ],
  };

  const payoutDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" as const },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed?: number; label?: string }) => {
            const amount = ctx.parsed ?? 0;
            const label = ctx.label ?? "";
            return `${label}: ${formatMoney(amount, chartData.currency)}`;
          },
        },
      },
    },
    cutout: "55%",
  } as const;

  const [salesRange, setSalesRange] = React.useState<
    "today" | "weekly" | "yearly"
  >("weekly");

  const recentInvoices = !merchantId
    ? []
    : invoices
        .filter((inv) => inv.merchantId === merchantId && !inv.deletedAt)
        .slice()
        .sort((a, b) => {
          const ta = new Date(a.invoiceDate ?? a.createdAt ?? 0).getTime();
          const tb = new Date(b.invoiceDate ?? b.createdAt ?? 0).getTime();
          return tb - ta;
        })
        .slice(0, 5);

  const topSellingProducts = (() => {
    // Placeholder list (your current stores don’t expose product-level aggregation here)
    return [
      {
        name: "Chair with Cushion",
        category: "Furniture",
        price: "$124",
        sales: "260 Sales",
      },
      {
        name: "Hand Bag",
        category: "Accessories",
        price: "$564",
        sales: "181 Sales",
      },
      {
        name: "Sneakers",
        category: "Sports",
        price: "$964",
        sales: "134 Sales",
      },
      {
        name: "Ron Hoodie",
        category: "Fashion",
        price: "$769",
        sales: "127 Sales",
      },
      {
        name: "Smart Watch",
        category: "Electronics",
        price: "$999",
        sales: "108 Sales",
      },
    ];

  return (
    <HeaderPage title={t("title")}>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-sm">
            <Select value={merchantId} onValueChange={setMerchantId}>
              <SelectTrigger className="h-9 w-full bg-card">
                <SelectValue placeholder={t("placeholders.selectMerchant")} />
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
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col gap-3 lg:col-span-3">
            <div className="flex-1">
              <KpiCard
                title={t("metrics.totalSales")}
                value={formatMoney(
                  summary?.totalSales ?? 0,
                  summary?.currency ?? "JPY",
                )}
                delta={5.1}
                icon={<ShoppingCart className="h-5 w-5 text-indigo-600" />}
                iconBgClass="bg-indigo-50"
              />
            </div>
            <div className="flex-1">
              <KpiCard
                title={t("metrics.transactionCount")}
                value={String(summary?.transactionCount ?? 0)}
                delta={0.6}
                icon={<Package className="h-5 w-5 text-fuchsia-600" />}
                iconBgClass="bg-fuchsia-50"
              />
            </div>
            <div className="flex-1">
              <KpiCard
                title={t("metrics.totalFees")}
                value={formatMoney(
                  summary?.totalFees ?? 0,
                  summary?.currency ?? "JPY",
                )}
                delta={-1.08}
                icon={<DollarSign className="h-5 w-5 text-rose-600" />}
                iconBgClass="bg-rose-50"
              />
            </div>
            <div className="flex-1">
              <KpiCard
                title={t("metrics.pendingPayoutAmount")}
                value={formatMoney(
                  summary?.pendingPayoutAmount ?? 0,
                  summary?.currency ?? "JPY",
                )}
                delta={2.3}
                icon={<BarChart3 className="h-5 w-5 text-orange-600" />}
                iconBgClass="bg-orange-50"
              />
            </div>
          </div>

          <div className="flex flex-col lg:col-span-6">
            <div className="flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">Sales Report</div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={salesRange === "today" ? "default" : "outline"}
                    className="h-8"
                    onClick={() => setSalesRange("today")}
                  >
                    Today
                  </Button>
                  <Button
                    size="sm"
                    variant={salesRange === "weekly" ? "default" : "outline"}
                    className="h-8"
                    onClick={() => setSalesRange("weekly")}
                  >
                    Weekly
                  </Button>
                  <Button
                    size="sm"
                    variant={salesRange === "yearly" ? "default" : "outline"}
                    className="h-8"
                    onClick={() => setSalesRange("yearly")}
                  >
                    Yearly
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex-1">
                {chartData.salesByMonth.length === 0 ? (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                    {t("charts.noData")}
                  </div>
                ) : (
                  <div className="h-full min-h-[320px]">
                    <Line data={salesLineData} options={salesLineOptions} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <div className="rounded-2xl border bg-gradient-to-br from-indigo-600 to-sky-600 p-4 text-white shadow-sm">
              <div className="space-y-2">
                <div className="text-lg font-semibold">Today's Sale</div>
                <div className="text-xs text-white/90">
                  Up to 20% off on HeadPhones
                </div>
                <div className="text-xs text-white/90">
                  Price: $9.99&nbsp;&nbsp;Discount: 20%
                </div>
              </div>
              <Button
                size="sm"
                className="bg-card/15 mt-3 h-8 text-card-foreground hover:bg-card/20"
              >
                Add to Cart
              </Button>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">
                  Top-Selling Products
                </div>
                <Button size="sm" variant="outline" className="h-8">
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {topSellingProducts.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {p.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {p.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{p.price}</div>
                      <div className="text-muted-foreground text-xs">
                        {p.sales}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-8">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Recent Orders</div>
              <Button size="sm" variant="outline" className="h-8">
                View All
              </Button>
            </div>

            <div className="text-muted-foreground grid grid-cols-5 gap-2 border-b pb-2 text-xs">
              <div>Order ID</div>
              <div className="col-span-2">Customer</div>
              <div>Date</div>
              <div className="text-right">Amount</div>
            </div>

            <div className="divide-y">
              {recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="grid grid-cols-5 items-center gap-2 py-3 text-sm"
                >
                  <div className="text-indigo-600">
                    #{String(inv.id).slice(-6)}
                  </div>
                  <div className="col-span-2">
                    <div className="font-medium">
                      {selectedMerchant?.name ?? "—"}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {inv.direction ?? "—"}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {String(inv.invoiceDate ?? inv.createdAt ?? "—")}
                  </div>
                  <div className="text-right font-medium">
                    {formatMoney(inv.amount ?? 0, inv.currency ?? "JPY")}
                  </div>
                </div>
              ))}
              {recentInvoices.length === 0 ? (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  {t("charts.noData")}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Total Orders</div>
              <Button size="sm" variant="outline" className="h-8">
                View All
              </Button>
            </div>
            <div className="text-muted-foreground text-xs">
              Overall Growth from Last Year
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-lg font-semibold">
                {summary?.transactionCount ?? 0}
              </div>
              <div className="text-sm font-semibold text-emerald-600">+15%</div>
            </div>
            <div className="mt-3 h-[220px]">
              {chartData.payoutByStatus.length === 0 ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  {t("charts.noData")}
                </div>
              ) : (
                <Doughnut
                  data={payoutDoughnutData}
                  options={payoutDoughnutOptions}
                />
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border p-3">
                <div className="text-muted-foreground">
                  {t("metrics.status")}
                </div>
                <div className="mt-1">
                  <Badge
                    variant={statusBadgeVariant(selectedMerchant?.status)}
                  >
                    {selectedMerchant?.status
                      ? t(`statuses.${selectedMerchant.status}`)
                      : "—"}
                  </Badge>
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-muted-foreground">
                  {t("metrics.lastUpdated")}
                </div>
                <div className="mt-1 text-sm font-medium">
                  {formatDateTime(summary?.lastUpdatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeaderPage>
  );
}
