"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useInvoiceStore } from "@/store/invoice-store";
import { useTransactionStore } from "@/store/transaction-store";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    CreditCard,
    Search,
} from "lucide-react";
import { uuid } from "@/lib/utils";
import type { Payment } from "@/lib/types";
import { Suspense } from "react";
import HeaderPage from "@/components/header-page";

type Step = "search" | "invoice" | "input" | "processing" | "completed";

function CreditPaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const t = useTranslations("Merchant.CreditPayment");

    const paramInvoiceId = searchParams.get("invoice_id");

    const [step, setStep] = React.useState<Step>(
        paramInvoiceId ? "invoice" : "search",
    );
    const [invoiceId, setInvoiceId] = React.useState<string>(
        paramInvoiceId || "",
    );
    const [error, setError] = React.useState<string | null>(null);
    const [completedTransactionId, setCompletedTransactionId] = React.useState<
        string | null
    >(null);
    const [cardNumber, setCardNumber] = React.useState("");
    const [expiry, setExpiry] = React.useState("");
    const [cvc, setCvc] = React.useState("");
    const [cardName, setCardName] = React.useState("");

    const invoiceStore = useInvoiceStore();
    const transactionStore = useTransactionStore();
    const { clients } = useAppStore();

    React.useEffect(() => {
        setError(null);
    }, [step]);

    const invoice = React.useMemo(() => {
        if (!invoiceId) return null;
        return invoiceStore.getInvoiceById(invoiceId);
    }, [invoiceId, invoiceStore]);

    const client = React.useMemo(() => {
        if (!invoice?.clientId) return null;
        return clients.find((c) => c.id === invoice.clientId);
    }, [invoice, clients]);

    React.useEffect(() => {
        if (paramInvoiceId) {
            const found = invoiceStore.getInvoiceById(paramInvoiceId);
            if (!found) {
                setInvoiceId(paramInvoiceId);
                setError("Invoice not found");
                setStep("search");
            } else if (found.status === "paid") {
                setStep("completed");
            } else {
                setStep("invoice");
            }
        }
    }, [paramInvoiceId, invoiceStore]);

    const handleFindInvoice = () => {
        if (!invoiceId.trim()) {
            setError("Please enter an Invoice ID");
            return;
        }

        const found = invoiceStore.getInvoiceById(invoiceId);
        if (found) {
            setError(null);
            if (found.status === "paid") {
                setStep("completed");
            } else {
                setStep("invoice");
            }
        } else {
            setError("Invoice not found. Please check the ID and try again.");
        }
    };

    const handlePayment = async () => {
        if (!invoice) return;

        setStep("processing");
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (cardNumber.endsWith("0000")) {
            setStep("input");
            setError("Card declined. Please try another card.");
            return;
        }

        const newTxnId = uuid("txn");
        const transaction: Payment = {
            id: newTxnId,
            invoiceId: invoice.id,
            merchantId: invoice.merchantId,
            amount: invoice.amount,
            fee: invoice.amount * 0.035,
            totalAmount: invoice.amount,
            status: "settled",
            paymentMethod: "Credit Card",
            createdAt: new Date().toISOString(),
            settledAt: new Date().toISOString(),
        };

        transactionStore.addTransaction(transaction);
        invoiceStore.updateInvoice(invoice.id, { status: "paid" });
        setCompletedTransactionId(newTxnId);

        setStep("completed");
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    return (
        <div className="min-h-screen px-4 py-10">
            <div className="mx-auto max-w-2xl space-y-6">
                {step === "search" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("findInvoice")}</CardTitle>
                            <CardDescription>{t("enterInvoiceId")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="invoiceId">{t("invoiceId")}</Label>
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute left-3 top-2.5 h-4" />
                                    <Input
                                        id="invoiceId"
                                        placeholder="e.g. inv_001"
                                        className="pl-8"
                                        value={invoiceId}
                                        onChange={(e) => setInvoiceId(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleFindInvoice();
                                        }}
                                    />
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    {t("try")}{" "}
                                    <span className="text-primary font-mono">inv_demo_001</span>{" "}
                                    {t("for_a_demo")}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleFindInvoice}>
                                {t("next")}
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {step === "invoice" && invoice && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("invoicePayment")}</CardTitle>
                            <CardDescription>
                                {t("reviewInvoiceDetailsBeforeProceeding")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-muted-foreground">
                                    {t("invoiceNumber")}
                                </div>
                                <div className="text-right font-medium">
                                    {invoice.invoiceNumber}
                                </div>

                                <div className="text-muted-foreground">{t("client")}</div>
                                <div className="text-right font-medium">
                                    {client?.name || "-"}
                                </div>

                                <div className="text-muted-foreground">{t("dueDate")}</div>
                                <div className="text-right font-medium">
                                    {invoice.dueDate || "-"}
                                </div>

                                <Separator className="col-span-2 my-2" />

                                <div className="text-lg font-semibold">{t("totalAmount")}</div>
                                <div className="text-right text-xl font-bold text-indigo-600">
                                    {formatCurrency(invoice.amount, invoice.currency)}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-4">
                            <Button variant="outline" onClick={() => setStep("search")}>
                                {t("back")}
                            </Button>
                            <Button
                                className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                                size="lg"
                                onClick={() => setStep("input")}
                            >
                                {t("proceedToPayment")}
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {step === "input" && invoice && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("creditCardDetails")}</CardTitle>
                            <CardDescription>
                                {t("enterYourCardInformationSecurely")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">{t("cardNumber")}</Label>
                                <div className="relative">
                                    <CreditCard className="text-muted-foreground absolute left-3 top-2.5 h-4 w-4" />
                                    <Input
                                        id="cardNumber"
                                        placeholder="0000 0000 0000 0000"
                                        className="pl-8"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\D/g, "").slice(0, 16);
                                            const formattedValue = rawValue.replace(
                                                /(\d{4})(?=\d)/g,
                                                "$1-",
                                            );
                                            setCardNumber(formattedValue);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry">{t("expirationDate")}</Label>
                                    <Input
                                        id="expiry"
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvc">{t("cvv")}</Label>
                                    <Input
                                        id="cvc"
                                        placeholder="123"
                                        type="password"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">{t("cardholderName")}</Label>
                                <Input
                                    id="name"
                                    placeholder={t("cardholderNamePlaceholder")}
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                />
                            </div>

                            <div className="bg-muted flex items-center justify-between rounded-lg p-4">
                                <span className="text-sm font-medium">{t("totalToPay")}</span>
                                <span className="text-lg font-bold">
                                    {formatCurrency(invoice.amount, invoice.currency)}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-4">
                            <Button variant="outline" onClick={() => setStep("invoice")}>
                                {t("back")}
                            </Button>
                            <Button className="flex-1" onClick={handlePayment}>
                                {t("pay")} {formatCurrency(invoice.amount, invoice.currency)}
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {step === "processing" && (
                    <Card className="flex flex-col items-center justify-center p-12 text-center">
                        <Loader2 className="text-primary mb-4 h-12 w-12 animate-spin" />
                        <CardTitle>{t("processingPayment")}</CardTitle>
                        <CardDescription className="mt-2">
                            {t("pleaseDoNotCloseThisWindow")}
                        </CardDescription>
                    </Card>
                )}

                {step === "completed" && invoice && (
                    <Card className="border-green-100 bg-green-50/50 dark:bg-green-900/10">
                        <CardHeader className="pb-2 text-center">
                            <div className="mx-auto mb-4 w-fit rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-green-700 dark:text-green-400">
                                {t("paymentSuccessful")}
                            </CardTitle>
                            <CardDescription>
                                {t("paymentSuccessfulDescription")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="bg-background space-y-2 rounded-lg border p-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {t("invoiceNumber")}
                                    </span>
                                    <span className="font-medium">{invoice.invoiceNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {t("amountPaid")}
                                    </span>
                                    <span className="font-bold">
                                        {formatCurrency(invoice.amount, invoice.currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {t("paymentDate")}
                                    </span>
                                    <span className="font-medium">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {t("transactionId")}
                                    </span>
                                    <span className="font-mono text-xs">
                                        {completedTransactionId ||
                                            transactionStore.transactions[0]?.id ||
                                            "TXN-????"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => {
                                    setStep("search");
                                    setInvoiceId("");
                                    setCompletedTransactionId(null);
                                }}
                            >
                                {t("payAnotherInvoice")}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default function CreditPaymentPage() {
    const t = useTranslations("Merchant.CreditPayment");
    return (
        <HeaderPage title={t("title")} capitalizeTitle={false}>
            <Suspense
                fallback={
                    <div className="flex h-screen items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                }
            >
                <CreditPaymentContent />
            </Suspense>
        </HeaderPage>
    );
}
