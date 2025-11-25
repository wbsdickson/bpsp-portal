import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const merchants = [
    { id: "M001", name: "TechCorp Solutions", status: "active", transactions: 1250, volume: "$450,000" },
    { id: "M002", name: "Global Retail Inc", status: "active", transactions: 3400, volume: "$1,200,000" },
    { id: "M003", name: "Small Biz Co", status: "pending", transactions: 0, volume: "$0" },
    { id: "M004", name: "Digital Services", status: "suspended", transactions: 45, volume: "$12,000" },
    { id: "M005", name: "E-Shop Plus", status: "active", transactions: 890, volume: "$230,000" },
];

export default function MerchantManagementPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Merchant Management</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Registered Merchants</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Merchant Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Transactions</TableHead>
                                <TableHead className="text-right">Total Volume</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {merchants.map((merchant) => (
                                <TableRow key={merchant.id}>
                                    <TableCell className="font-medium">{merchant.id}</TableCell>
                                    <TableCell>{merchant.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={merchant.status === 'active' ? 'default' : merchant.status === 'pending' ? 'secondary' : 'destructive'}>
                                            {merchant.status.replace(/_/g, ' ').toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{merchant.transactions}</TableCell>
                                    <TableCell className="text-right">{merchant.volume}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
