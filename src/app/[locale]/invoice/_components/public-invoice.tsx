"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useInvoiceStore } from "@/store/invoice-store";
import { Bill } from "./bill";
import { useLocale, useTranslations } from "next-intl";
import { PayInfo } from "./pay-info";
import { useRouter } from "next/navigation";

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function PublicInvoicePage({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const t = useTranslations("Operator.Invoice");
  const invoiceNumber = decodeURIComponent(invoiceId);

  const invoice = useInvoiceStore((s) => s.getInvoiceByNumber(invoiceNumber));

  const merchants = useAppStore((s) => s.merchants);
  const clients = useAppStore((s) => s.clients);

  const router = useRouter();
  const locale = useLocale();

  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "bank">(
    "card",
  );

  const [cardStep, setCardStep] = React.useState<"options" | "payInfo">(
    "options",
  );

  React.useEffect(() => {
    if (paymentMethod !== "card") {
      setCardStep("options");
    }
  }, [paymentMethod]);

  const merchant = React.useMemo(() => {
    if (!invoice) return null;
    return merchants.find((m) => m.id === invoice.merchantId) ?? null;
  }, [invoice, merchants]);

  const client = React.useMemo(() => {
    if (!invoice) return null;
    return clients.find((c) => c.id === invoice.clientId) ?? null;
  }, [invoice, clients]);

  const onRegister = () => {
    router.push(
      `/${locale}/register?callbackUrl=${encodeURIComponent(
        `invoice/${invoiceNumber}`,
      )}`,
    );
  };

  const onLogin = () => {
    router.push(
      `/${locale}/signin?callbackUrl=${encodeURIComponent(
        `invoice/${invoiceNumber}`,
      )}`,
    );
  };

  if (!invoice) {
    return (
      <div className="bg-muted/30 min-h-[calc(100vh-0px)] p-6">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>{t("publicInvoiceNotFoundTitle")}</CardTitle>
              <CardDescription>
                {t("publicInvoiceNotFoundDescription", { invoiceNumber })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                {t("publicInvoiceNotFoundHint")}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-0px)] p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="bg-muted/10 rounded-lg border p-6">
          <div className="flex items-center justify-end">
            <Button variant="ghost" size="sm" type="button">
              <Download className="mr-2 h-4 w-4" />
              {t("publicDownload")}
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as "card" | "bank")}
                className="space-y-3"
              >
                <label className="flex items-center gap-3 rounded-md bg-blue-50 px-4 py-3 dark:bg-blue-950/40">
                  <RadioGroupItem value="card" />
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {t("publicPayWithCard")}
                  </div>
                </label>

                {paymentMethod === "card" && (
                  <>
                    {cardStep === "options" ? (
                      <div className="bg-background space-y-4 rounded-md border p-6">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-14 w-full rounded-xl border-2 text-base"
                          onClick={() => setCardStep("payInfo")}
                        >
                          {t("publicPayWithoutRegistration")}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-14 w-full rounded-xl border-2 text-base"
                          onClick={onRegister}
                        >
                          {t("publicRegister")}
                        </Button>

                        <div className="py-2">
                          <Separator />
                          <div className="text-muted-foreground py-3 text-center text-xs">
                            {t("publicAlreadyHaveAccount")}
                          </div>
                          <Separator />
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className="h-14 w-full rounded-xl border-2 text-base"
                          onClick={onLogin}
                        >
                          {t("publicLogin")}
                        </Button>
                      </div>
                    ) : (
                      <PayInfo onBack={() => setCardStep("options")} />
                    )}
                  </>
                )}

                <label className="flex items-center gap-3 rounded-md bg-blue-50 px-4 py-3 dark:bg-blue-950/40">
                  <RadioGroupItem value="bank" />
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {t("publicPayByBankTransfer")}
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="bg-muted rounded-md p-5">
                <div className="max-h-[calc(100vh-220px)] overflow-auto">
                  <div className="w-full shadow-sm">
                    <Bill
                      invoice={invoice}
                      merchant={merchant}
                      client={client}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
