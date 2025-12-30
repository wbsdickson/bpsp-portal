"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuotationStatus } from "@/lib/types";
import { useClientStore } from "@/store/client-store";
import { useQuotationStore } from "@/store/quotation-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type QuotationUpsertValues = {
  quotationNumber: string;
  clientId: string;
  quotationDate: string;
  amount: string;
  status: QuotationStatus;
};

const STATUS_OPTIONS: QuotationStatus[] = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
];

export default function QuotationUpsertForm({
  quotationId,
}: {
  quotationId: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Quotations");

  const quotation = useQuotationStore((s) => s.getQuotationById(quotationId));
  const updateQuotation = useQuotationStore((s) => s.updateQuotation);

  const clients = useClientStore((s) => s.clients);

  const schema = React.useMemo(
    () =>
      z.object({
        quotationNumber: z.string().min(1, t("validation.numberRequired")),
        clientId: z.string().min(1, t("validation.clientRequired")),
        quotationDate: z.string().min(1, t("validation.issueDateRequired")),
        amount: z
          .string()
          .min(1, t("validation.amountRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)),
            t("validation.amountInvalid"),
          ),
        status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]),
      }),
    [t],
  );

  const form = useForm<QuotationUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quotationNumber: quotation?.quotationNumber ?? "",
      clientId: quotation?.clientId ?? "",
      quotationDate: quotation?.quotationDate ?? "",
      amount: String(quotation?.amount ?? ""),
      status: (quotation?.status ?? "draft") as QuotationStatus,
    },
  });

  useEffect(() => {
    form.reset({
      quotationNumber: quotation?.quotationNumber ?? "",
      clientId: quotation?.clientId ?? "",
      quotationDate: quotation?.quotationDate ?? "",
      amount: String(quotation?.amount ?? ""),
      status: (quotation?.status ?? "draft") as QuotationStatus,
    });
  }, [form, quotation]);

  const onSubmit = form.handleSubmit((data) => {
    updateQuotation(quotationId, {
      quotationNumber: data.quotationNumber.trim(),
      clientId: data.clientId,
      quotationDate: data.quotationDate,
      amount: Number(data.amount),
      status: data.status,
    });

    router.push(`/${locale}/operator/quotations`);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.editTitle")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="quotationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.number")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.numberPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.client")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectClient")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quotationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.issueDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.amount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder={t("form.amountPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.status")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {t(`statuses.${s}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => router.push(`/${locale}/operator/quotations`)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="submit"
              className="h-9 bg-indigo-600 hover:bg-indigo-700"
            >
              {t("buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
