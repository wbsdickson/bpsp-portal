'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Building } from 'lucide-react';

export default function PaymentPage() {
    const router = useRouter();
    const { currentUser, getMerchantInvoices, createPayment } = useAppStore();
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    if (!currentUser) return <div>Loading...</div>;

    const invoices = getMerchantInvoices(currentUser.id).filter(
        (inv) => inv.status === 'approved' || inv.status === 'pending'
    );

    const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);
    const fee = selectedInvoice ? selectedInvoice.amount * 0.02 : 0;
    const total = selectedInvoice ? selectedInvoice.amount + fee : 0;

    const handlePayment = () => {
        if (selectedInvoiceId) {
            createPayment(selectedInvoiceId, paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer');
            router.push('/dashboard/merchant');
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
                        <Select onValueChange={setSelectedInvoiceId} value={selectedInvoiceId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an invoice" />
                            </SelectTrigger>
                            <SelectContent>
                                {invoices.map((inv) => (
                                    <SelectItem key={inv.id} value={inv.id}>
                                        {inv.recipientName} - ${inv.amount.toLocaleString()} (Due: {inv.dueDate})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                </CardContent>
            </Card>

            {selectedInvoice && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Select how you want to fund this payment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                <Label
                                    htmlFor="card"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <CreditCard className="mb-3 h-6 w-6" />
                                    Credit Card
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                                <Label
                                    htmlFor="bank"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <Building className="mb-3 h-6 w-6" />
                                    Bank Transfer
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
            )}

            {selectedInvoice && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span>Principal Amount</span>
                            <span>${selectedInvoice.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>BPSP Fee (2%)</span>
                            <span>${fee.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                            <span>Total Charge</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" size="lg" onClick={handlePayment}>
                            Pay ${total.toLocaleString()}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
