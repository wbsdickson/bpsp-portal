import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const agreements = [
    { id: "LA-2023-001", property: "Sunset Apartments, Unit 4B", tenant: "Alice Johnson", date: "2023-11-01", status: "Active" },
    { id: "LA-2023-002", property: "Downtown Lofts, #12", tenant: "Mark Wilson", date: "2023-11-15", status: "Pending" },
    { id: "LA-2023-003", property: "Green Valley House", tenant: "Sarah Davis", date: "2023-11-20", status: "Active" },
    { id: "LA-2023-004", property: "Ocean View, 5A", tenant: "John Doe", date: "2023-10-05", status: "Expired" },
];

export default function LeaseAgreementPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Lease Agreements</h2>
                <Button>New Agreement</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Agreement Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agreement ID</TableHead>
                                <TableHead>Property</TableHead>
                                <TableHead>Tenant</TableHead>
                                <TableHead>Signed Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agreements.map((agreement) => (
                                <TableRow key={agreement.id}>
                                    <TableCell className="font-medium">{agreement.id}</TableCell>
                                    <TableCell>{agreement.property}</TableCell>
                                    <TableCell>{agreement.tenant}</TableCell>
                                    <TableCell>{agreement.date}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${agreement.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                agreement.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {agreement.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
