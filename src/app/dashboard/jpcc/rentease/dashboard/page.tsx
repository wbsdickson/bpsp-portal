import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, CheckCircle, DollarSign, Smartphone, AlertTriangle, XCircle, Award } from "lucide-react";

export default function RentEaseDashboardPage() {
    const stats = [
        {
            title: "Total Users",
            value: "12,345",
            icon: Users,
            description: "Active users on platform",
            color: "text-blue-500"
        },
        {
            title: "IDV Verified",
            value: "10,892",
            icon: ShieldCheck,
            description: "88.2% verification rate",
            color: "text-green-500"
        },
        {
            title: "Payment Complete",
            value: "8,432",
            icon: CheckCircle,
            description: "Successful transactions",
            color: "text-emerald-500"
        },
        {
            title: "Remittance Amount",
            value: "$4.2M",
            icon: DollarSign,
            description: "Total processed volume",
            color: "text-yellow-500"
        },
        {
            title: "App Version",
            value: "v2.4.1",
            icon: Smartphone,
            description: "iOS: 65% / Android: 35%",
            color: "text-purple-500"
        },
        {
            title: "IDV Suspended",
            value: "145",
            icon: AlertTriangle,
            description: "Requires manual review",
            color: "text-orange-500"
        },
        {
            title: "Payment Failed",
            value: "23",
            icon: XCircle,
            description: "Last 24 hours",
            color: "text-red-500"
        },
        {
            title: "Total Points",
            value: "1.5M",
            icon: Award,
            description: "Loyalty points issued",
            color: "text-indigo-500"
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">RentEase Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
