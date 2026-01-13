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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useInvoiceStore } from "@/store/invoice-store";
import { Bill } from "./bill";
import { useLocale, useTranslations } from "next-intl";
import { PayInfo } from "./pay-info";
import { useRouter } from "next/navigation";
import LocaleSwitcher from "@/components/locale-switcher";

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
      <div className="bg-muted/30 flex h-screen items-center justify-center p-6">
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
    <div className="bg-background flex h-screen flex-col p-6">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col rounded-lg bg-white">
        <div className="bg-muted/10 flex h-full flex-col overflow-hidden rounded-lg border shadow">
          <div className="flex shrink-0 items-center justify-end gap-2 p-6 pb-4">
            <LocaleSwitcher />
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t("publicDownload")}
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 gap-6 overflow-hidden px-6 pb-6">
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as "card" | "bank")}
                >
                  <label className="z-10 flex cursor-pointer items-center gap-3 rounded-md bg-blue-200 px-4 py-3 hover:bg-blue-100 dark:bg-blue-950/40">
                    <RadioGroupItem
                      value="card"
                      className="border-gray-400 bg-white"
                    />
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t("publicPayWithCard")}
                    </div>
                  </label>

                  {paymentMethod === "card" && (
                    <>
                      {cardStep === "options" ? (
                        <div className="bg-background relative top-[-16px] space-y-4 rounded-b-md border p-6">
                          <Button
                            variant="outline"
                            className="h-14 w-full rounded-xl border-2 text-base"
                            onClick={() => setCardStep("payInfo")}
                          >
                            {t("publicPayWithoutRegistration")}
                          </Button>
                          <Button
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

                  <label className="flex cursor-pointer items-center gap-3 rounded-md bg-blue-200 px-4 py-3 hover:bg-blue-100 dark:bg-blue-950/40">
                    <RadioGroupItem
                      value="bank"
                      className="border-gray-400 bg-white"
                    />
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t("publicPayByBankTransfer")}
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </ScrollArea>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="bg-muted flex min-h-0 flex-1 flex-col overflow-hidden rounded-md p-5">
                <ScrollArea className="h-full w-full">
                  <div className="w-full pr-4 shadow-sm">
                    <Bill
                      invoice={invoice}
                      merchant={merchant}
                      client={client}
                    />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
