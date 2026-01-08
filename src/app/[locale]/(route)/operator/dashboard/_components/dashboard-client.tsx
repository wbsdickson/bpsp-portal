"use client";

import * as React from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarDays,
  Filter,
  Share2,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type KpiCardProps = {
  title: string;
  value: string;
  deltaLabel: string;
  deltaDirection: "up" | "down";
  icon: React.ReactNode;
  iconBgClass: string;
};

function KpiCard({
  title,
  value,
  deltaLabel,
  deltaDirection,
  icon,
  iconBgClass,
}: KpiCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="text-muted-foreground text-xs font-medium">
              {title}
            </div>
            <div className="text-2xl font-semibold leading-none">{value}</div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              {deltaDirection === "up" ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-rose-600" />
              )}
              <span
                className={
                  deltaDirection === "up" ? "text-emerald-600" : "text-rose-600"
                }
              >
                {deltaLabel}
              </span>
            </div>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgClass}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const salesOverview = [
  { month: "Jan", sales: 220, profit: 160, growth: 110 },
  { month: "Feb", sales: 340, profit: 210, growth: 180 },
  { month: "Mar", sales: 180, profit: 140, growth: 120 },
  { month: "Apr", sales: 160, profit: 120, growth: 90 },
  { month: "May", sales: 380, profit: 260, growth: 210 },
  { month: "Jun", sales: 430, profit: 310, growth: 240 },
  { month: "Jul", sales: 520, profit: 380, growth: 270 },
  { month: "Aug", sales: 360, profit: 290, growth: 200 },
  { month: "Sep", sales: 410, profit: 320, growth: 210 },
  { month: "Oct", sales: 640, profit: 440, growth: 310 },
  { month: "Nov", sales: 460, profit: 360, growth: 230 },
  { month: "Dec", sales: 490, profit: 370, growth: 260 },
];

const orderBreakdown = [
  { name: "Delivered", value: 56, color: "#4F46E5" },
  { name: "Cancelled", value: 14, color: "#F43F5E" },
  { name: "Pending", value: 18, color: "#A855F7" },
  { name: "Returned", value: 12, color: "#FB923C" },
];

const categories = [
  {
    name: "Clothing",
    sales: "31,245",
    gross: "25% Gross",
    delta: "0.45%",
    color: "#4F46E5",
  },
  {
    name: "Electronics",
    sales: "29,553",
    gross: "16% Gross",
    delta: "0.27%",
    color: "#EC4899",
  },
  {
    name: "Grocery",
    sales: "24,577",
    gross: "22% Gross",
    delta: "0.63%",
    color: "#F43F5E",
  },
  {
    name: "Automobiles",
    sales: "19,278",
    gross: "18% Gross",
    delta: "1.14%",
    color: "#FB923C",
  },
  {
    name: "Others",
    sales: "15,934",
    gross: "15% Gross",
    delta: "3.87%",
    color: "#8B5CF6",
  },
];

const transactions = [
  { product: "SwiftBuds", price: "$39.99", status: "Success" },
  { product: "CozyCloud Pillow", price: "$19.95", status: "Pending" },
  { product: "AquaGrip Bottle", price: "$9.99", status: "Failed" },
  { product: "GlowLite Lamp", price: "$24.99", status: "Success" },
  { product: "FitTrack", price: "$49.95", status: "Success" },
];

const activity = [
  {
    time: "12 Hrs",
    user: "John Doe",
    message: "Updated the product description for Widget X.",
    color: "#4F46E5",
  },
  {
    time: "4:32pm",
    user: "Jane Smith",
    message: "Added a new user with username janesmith89.",
    color: "#EC4899",
  },
  {
    time: "11:45am",
    user: "Michael Brown",
    message: "Changed the status of order #12345 to shipped.",
    color: "#F43F5E",
  },
  {
    time: "9:27am",
    user: "David Wilson",
    message: "Added John Smith to academy group this day.",
    color: "#FB923C",
  },
];

const weeklySales = [
  { day: "Mon", a: 120, b: 60, c: 30 },
  { day: "Tue", a: 140, b: 90, c: 50 },
  { day: "Wed", a: 110, b: 70, c: 40 },
  { day: "Thu", a: 160, b: 80, c: 60 },
  { day: "Fri", a: 190, b: 120, c: 70 },
  { day: "Sat", a: 150, b: 95, c: 55 },
  { day: "Sun", a: 130, b: 75, c: 45 },
];

const merchantSalesRanking = [
  { name: "TechGiant Corp", sales: 450000 },
  { name: "Global Traders", sales: 320000 },
  { name: "EcoGoods Ltd", sales: 280000 },
  { name: "FashionForward", sales: 210000 },
  { name: "HomeEssentials", sales: 150000 },
];

const statsSpark = [
  { x: 1, y: 12 },
  { x: 2, y: 18 },
  { x: 3, y: 14 },
  { x: 4, y: 22 },
  { x: 5, y: 19 },
  { x: 6, y: 28 },
  { x: 7, y: 24 },
];

function StatRow({
  title,
  value,
  delta,
  trendColor,
}: {
  title: string;
  value: string;
  delta: string;
  trendColor: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-white p-3">
      <div className="space-y-1">
        <div className="text-muted-foreground text-xs">{title}</div>
        <div className="text-sm font-semibold">{value}</div>
        <div className="text-xs text-emerald-600">{delta}</div>
      </div>
      <div className="h-10 w-[88px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={statsSpark}>
            <Area
              type="monotone"
              dataKey="y"
              stroke={trendColor}
              fill={trendColor}
              fillOpacity={0.12}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          {/* <div className="text-xl font-semibold">Sales Dashboard</div> */}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button  variant="outline" className="h-9 bg-white">
            <CalendarDays className="mr-2 h-4 w-4" /> 2024-05-01 to 2024-05-30
          </Button>
          <Button  variant="outline" className="h-9 bg-white">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button
            
            className="h-9 "
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Total Products"
          value="854"
          deltaLabel="increased by 2.56%"
          deltaDirection="up"
          icon={<ShoppingCart className="h-5 w-5 text-indigo-600" />}
          iconBgClass="bg-indigo-50"
        />
        <KpiCard
          title="Total Users"
          value="31,876"
          deltaLabel="increased by 0.34%"
          deltaDirection="up"
          icon={<Users className="h-5 w-5 text-fuchsia-600" />}
          iconBgClass="bg-fuchsia-50"
        />
        <KpiCard
          title="Total Revenue"
          value="$34,241"
          deltaLabel="increased by 7.66%"
          deltaDirection="up"
          icon={<DollarSign className="h-5 w-5 text-rose-600" />}
          iconBgClass="bg-rose-50"
        />
        <KpiCard
          title="Total Sales"
          value="176,586"
          deltaLabel="decreased by 0.74%"
          deltaDirection="down"
          icon={<BarChart3 className="h-5 w-5 text-orange-600" />}
          iconBgClass="bg-orange-50"
        />

      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Sales Overview</CardTitle>
              <CardDescription>Monthly performance</CardDescription>
            </div>
            <Button  variant="outline" className="h-8 bg-white">
              Sort By
            </Button>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesOverview} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="growth" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#A855F7"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Order Statistics</CardTitle>
              <CardDescription>Total orders and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-muted-foreground text-xs">
                    Total Orders
                  </div>
                  <div className="text-xl font-semibold">3,736</div>
                  <div className="text-xs text-emerald-600">+0.57%</div>
                </div>
                <div className="text-xs text-emerald-600">Earnings ?</div>
              </div>

              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={46}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {orderBreakdown.map((it) => (
                        <Cell key={it.name} fill={it.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {orderBreakdown.map((it) => (
                  <div key={it.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: it.color }}
                    />
                    <span className="text-muted-foreground">{it.name}</span>
                  </div>
                ))}
              </div>

              <Button
                
                variant="outline"
                className="h-9 w-full bg-white"
              >
                Complete Statistics
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Top Selling Categories
                </CardTitle>
                <CardDescription>Overall sales</CardDescription>
              </div>
              <Button  variant="outline" className="h-8 bg-white">
                Sort By
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex h-2 overflow-hidden rounded-full">
                {categories.map((c) => (
                  <div
                    key={c.name}
                    className="h-full"
                    style={{
                      backgroundColor: c.color,
                      width: `${100 / categories.length}%`,
                    }}
                  />
                ))}
              </div>

              <div className="space-y-3">
                {categories.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <div className="text-sm font-medium">{c.name}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground text-xs">
                        {c.sales}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {c.gross}
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700"
                      >
                        {c.delta}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Latest Transactions</CardTitle>
            <Button  variant="ghost" className="h-8 px-2">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-muted-foreground grid grid-cols-3 text-xs">
              <div>Product</div>
              <div className="text-right">Price</div>
              <div className="text-right">Status</div>
            </div>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.product}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-white p-3"
                >
                  <div className="text-sm font-medium">{tx.product}</div>
                  <div className="text-sm tabular-nums">{tx.price}</div>
                  <div className="flex justify-end">
                    <Badge
                      variant="secondary"
                      className={
                        tx.status === "Success"
                          ? "bg-emerald-50 text-emerald-700"
                          : tx.status === "Pending"
                            ? "bg-fuchsia-50 text-fuchsia-700"
                            : "bg-rose-50 text-rose-700"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Button  variant="ghost" className="h-8 px-2">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((a) => (
              <div key={a.time} className="flex gap-3">
                <div className="text-muted-foreground w-14 text-xs">
                  {a.time}
                </div>
                <div
                  className="mt-1 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: a.color }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{a.user}</div>
                  <div className="text-muted-foreground text-xs">
                    {a.message}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Merchant Sales Ranking</CardTitle>
            <Button  variant="outline" className="h-8 bg-white">
              Sort By
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border bg-white p-3">
                <div className="text-muted-foreground text-xs">Total Sales</div>
                <div className="text-sm font-semibold">$3.478B</div>
              </div>
              <div className="rounded-xl border bg-white p-3">
                <div className="text-muted-foreground text-xs">This Year</div>
                <div className="text-sm font-semibold text-emerald-600">
                  4,25,349
                </div>
              </div>
              <div className="rounded-xl border bg-white p-3">
                <div className="text-muted-foreground text-xs">Last Year</div>
                <div className="text-sm font-semibold text-rose-600">
                  3,41,622
                </div>
              </div>
              <div className="rounded-xl border bg-white p-3">
                <div className="text-muted-foreground text-xs">Growth</div>
                <div className="text-sm font-semibold">+12.4%</div>
              </div>
            </div> */}

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={merchantSalesRanking}
                  margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "Sales",
                    ]}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#4F46E5"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Overall Statistics</CardTitle>
            <Button  variant="ghost" className="h-8 px-2">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <StatRow
              title="Total Expenses"
              value="$134,032"
              delta="0.45%"
              trendColor="#4F46E5"
            />
            <StatRow
              title="General Leads"
              value="74,354"
              delta="-3.84%"
              trendColor="#EC4899"
            />
            <StatRow
              title="Churn Rate"
              value="6.02%"
              delta="0.72%"
              trendColor="#FB923C"
            />
            <StatRow
              title="New Users"
              value="7,893"
              delta="1.05%"
              trendColor="#8B5CF6"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
