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

const certificates = [
    {
        id: "CERT-8829-XJ",
        date: "2024-03-15",
        amount: "$2,400.00",
        payer: "Alice Johnson",
        purpose: "Security Deposit",
        status: "Issued",
    },
    {
        id: "CERT-9930-YK",
        date: "2024-03-10",
        amount: "$1,200.00",
        payer: "Bob Smith",
        purpose: "First Month Rent",
        status: "Issued",
    },
    {
        id: "CERT-7721-ZL",
        date: "2024-02-28",
        amount: "$500.00",
        payer: "Charlie Brown",
        purpose: "Pet Deposit",
        status: "Pending",
    },
    {
        id: "CERT-6610-WM",
        date: "2024-02-15",
        amount: "$1,200.00",
        payer: "Diana Prince",
        purpose: "Rent Renewal",
        status: "Issued",
    },
];

export default function PaymentCertificatePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">One-time Payment Certificates</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Certificate History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Certificate ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Payer</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.map((cert) => (
                                <TableRow key={cert.id}>
                                    <TableCell className="font-medium">{cert.id}</TableCell>
                                    <TableCell>{cert.date}</TableCell>
                                    <TableCell>{cert.payer}</TableCell>
                                    <TableCell>{cert.purpose}</TableCell>
                                    <TableCell>{cert.amount}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cert.status === 'Issued' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {cert.status.replace(/_/g, ' ').toUpperCase()}
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
