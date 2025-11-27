"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Invoice } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const cardSchema = z.object({
    cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format must be MM/YY"),
    cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
    cardholderName: z.string().min(2, "Cardholder name is required"),
});

export default function PaymentCreditCardPage() {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params.invoiceId as string;
    const { getInvoiceById, processPayment } = useAppStore();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const form = useForm<z.infer<typeof cardSchema>>({
        resolver: zodResolver(cardSchema),
        defaultValues: {
            cardNumber: "",
            expiryDate: "",
            cvc: "",
            cardholderName: "",
        },
    });

    useEffect(() => {
        const inv = getInvoiceById(invoiceId);
        if (inv) {
            setInvoice(inv);
            if (inv.status === 'paid') {
                router.replace(`/payment/${invoiceId}/complete`);
            }
        } else {
            router.replace(`/payment/${invoiceId}`); // Redirect back to handle error there
        }
        setLoading(false);
    }, [invoiceId, getInvoiceById, router]);

    async function onSubmit(values: z.infer<typeof cardSchema>) {
        setProcessing(true);
        try {
            const result = await processPayment(invoiceId, values);

            if (result.success) {
                toast.success("Payment successful!");
                router.push(`/payment/${invoiceId}/complete`);
            } else {
                toast.error(result.error || "Payment failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setProcessing(false);
        }
    }

    if (loading || !invoice) {
        return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Enter Card Details</h1>
                <p className="text-gray-500">
                    Paying <span className="font-bold text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}</span>
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard className="h-5 w-5" />
                        Credit Card
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Card Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0000 0000 0000 0000" {...field} maxLength={16} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="expiryDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expiry Date</FormLabel>
                                            <FormControl>
                                                <Input placeholder="MM/YY" {...field} maxLength={5} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cvc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CVC</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123" {...field} maxLength={4} type="password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="cardholderName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cardholder Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="JOHN DOE" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4">
                                <Button type="submit" className="w-full py-6 text-lg" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Pay {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="justify-center pb-6">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Payments are secure and encrypted
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
