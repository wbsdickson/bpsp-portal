import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const payments = [
    {
        id: "PAY-1001",
        date: "2024-03-15",
        amount: "$1,250.00",
        status: "Completed",
        method: "Credit Card",
        description: "Monthly Service Fee",
    },
    {
        id: "PAY-1002",
        date: "2024-03-14",
        amount: "$450.00",
        status: "Processing",
        method: "Bank Transfer",
        description: "Utility Payment",
    },
    {
        id: "PAY-1003",
        date: "2024-03-12",
        amount: "$2,100.00",
        status: "Completed",
        method: "Credit Card",
        description: "Quarterly Rent",
    },
    {
        id: "PAY-1004",
        date: "2024-03-10",
        amount: "$125.00",
        status: "Failed",
        method: "PayPal",
        description: "Late Fee",
    },
    {
        id: "PAY-1005",
        date: "2024-03-08",
        amount: "$850.00",
        status: "Completed",
        method: "Credit Card",
        description: "Maintenance",
    },
];

export default function PaymentPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Process Payment</h2>
            <div className="grid gap-6 md:grid-cols-2">

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">{payment.id}</TableCell>
                                        <TableCell>{payment.date}</TableCell>
                                        <TableCell>{payment.amount}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
