"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export default function PaymentPortalPage() {
    const router = useRouter();
    const [invoiceId, setInvoiceId] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (invoiceId.trim()) {
            router.push(`/dashboard/payment/${invoiceId.trim()}`);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Portal</CardTitle>
                    <CardDescription>Enter an invoice ID to view and pay an invoice.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSearch}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="invoiceId">Invoice ID</Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="invoiceId"
                                    placeholder="e.g. INV-001"
                                    className="pl-9"
                                    value={invoiceId}
                                    onChange={(e) => setInvoiceId(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Find Invoice
                        </Button>
                    </CardFooter>
                    <div className="px-6 pb-6 text-sm text-muted-foreground">
                        Use invoice ID: <code>inv_001</code> for demo
                    </div>
                </form>
            </Card>
        </div>
    );
}
