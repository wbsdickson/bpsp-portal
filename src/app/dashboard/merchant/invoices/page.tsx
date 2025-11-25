'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function InvoicesPage() {
    const { currentUser, getMerchantInvoices, addInvoice } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientBank: '',
        accountNumber: '',
        amount: '',
        dueDate: '',
    });

    const [fileName, setFileName] = useState<string | null>(null);

    if (!currentUser) return <div>Loading...</div>;

    const invoices = getMerchantInvoices(currentUser.id);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addInvoice({
            merchantId: currentUser.id,
            recipientName: formData.recipientName,
            recipientBank: formData.recipientBank,
            accountNumber: formData.accountNumber,
            amount: Number(formData.amount),
            currency: 'USD',
            dueDate: formData.dueDate,
            fileUrl: fileName ? `https://fake-storage.com/${fileName}` : undefined,
        });
        setIsOpen(false);
        setFormData({
            recipientName: '',
            recipientBank: '',
            accountNumber: '',
            amount: '',
            dueDate: '',
        });
        setFileName(null);
    }; const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-500';
            case 'approved': return 'bg-blue-500';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-yellow-500';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Invoices / 請求書</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Invoice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]" data-role={currentUser?.role}>
                        <DialogHeader>
                            <DialogTitle>Upload Invoice</DialogTitle>
                            <DialogDescription>
                                Enter invoice details manually or upload a file (simulated).
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="recipient" className="text-right">
                                    Recipient
                                </Label>
                                <Input
                                    id="recipient"
                                    value={formData.recipientName}
                                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="bank" className="text-right">
                                    Bank
                                </Label>
                                <Input
                                    id="bank"
                                    value={formData.recipientBank}
                                    onChange={(e) => setFormData({ ...formData, recipientBank: e.target.value })}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="account" className="text-right">
                                    Account #
                                </Label>
                                <Input
                                    id="account"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                    Amount
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dueDate" className="text-right">
                                    Due Date
                                </Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">File</Label>
                                <div className="col-span-3">
                                    <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            accept="image/*,.pdf"
                                        />
                                        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground block mt-2">
                                            {fileName ? fileName : "Drag & drop or click to upload"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Invoice</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Bank Details</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.recipientName}</TableCell>
                                <TableCell>
                                    <div className="text-sm">{invoice.recipientBank}</div>
                                    <div className="text-xs text-muted-foreground">{invoice.accountNumber}</div>
                                </TableCell>
                                <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                                <TableCell>{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(invoice.status)} variant="secondary">
                                        {invoice.status.replace(/_/g, ' ').toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="secondary" size="icon" title="View invoice">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {invoices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No invoices found. Upload one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
