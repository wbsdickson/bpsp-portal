'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PaymentPage() {
    const router = useRouter();
    const { currentUser, getMerchantInvoices } = useAppStore();
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    if (!currentUser) return <div>Loading...</div>;

    const invoices = getMerchantInvoices(currentUser.id).filter(
        (inv) => inv.status === 'approved' || inv.status === 'pending'
    );

    const filteredInvoices = invoices.filter(inv =>
        (inv.recipientName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        inv.amount.toString().includes(searchQuery) ||
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);
    const fee = selectedInvoice ? selectedInvoice.amount * 0.02 : 0;
    const total = selectedInvoice ? selectedInvoice.amount + fee : 0;

    const handlePayment = () => {
        if (selectedInvoiceId) {
            // Redirect to the new payment flow
            router.push(`/dashboard/payment/${selectedInvoiceId}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Make a Payment / 支払い</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Select Invoice</CardTitle>
                    <CardDescription>Choose an approved invoice to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Invoice</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {selectedInvoiceId
                                        ? (() => {
                                            const inv = invoices.find((i) => i.id === selectedInvoiceId);
                                            return inv ? `${inv.recipientName} - $${inv.amount.toLocaleString()}` : "Select an invoice...";
                                        })()
                                        : "Select an invoice..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                <div className="flex items-center border-b px-3">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                        placeholder="Search invoices..."
                                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0 shadow-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-[300px] overflow-y-auto p-1">
                                    {filteredInvoices.length === 0 && (
                                        <div className="py-6 text-center text-sm text-muted-foreground">No invoice found.</div>
                                    )}
                                    {filteredInvoices.map((inv) => (
                                        <div
                                            key={inv.id}
                                            className={cn(
                                                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                                selectedInvoiceId === inv.id ? "bg-accent text-accent-foreground" : ""
                                            )}
                                            onClick={() => {
                                                setSelectedInvoiceId(inv.id);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedInvoiceId === inv.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium">{inv.recipientName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {inv.invoiceNumber} - ${inv.amount.toLocaleString()} (Due: {inv.dueDate})
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {selectedInvoice && (
                        <div className="rounded-lg border p-4 bg-muted/50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Recipient:</span>
                                <span className="font-medium">{selectedInvoice.recipientName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Bank:</span>
                                <span className="font-medium">{selectedInvoice.recipientBank}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Account:</span>
                                <span className="font-medium">{selectedInvoice.accountNumber}</span>
                            </div>
                        </div>
                    )}
                    <Button className="w-full" size="lg" onClick={handlePayment}>
                        Proceed to Payment
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
