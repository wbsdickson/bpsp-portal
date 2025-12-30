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
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useMerchantStore } from "@/store/merchant-store";
import type {
  MerchantFeeStatus,
  PaymentMethodType,
} from "@/types/merchant-fee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type MerchantFeeUpsertValues = {
  merchantId: string;
  brand: string;
  paymentMethodType: PaymentMethodType;
  mdrPercent: string;
  fixedFee: string;
  status: MerchantFeeStatus;
};

const STATUS_OPTIONS: MerchantFeeStatus[] = ["active", "suspended"];
const PAYMENT_METHOD_OPTIONS: PaymentMethodType[] = ["card", "bank"];

export default function MerchantFeeUpsertForm({ feeId }: { feeId?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.MerchantFees");

  const fee = useMerchantFeeStore((s) =>
    feeId ? s.getFeeById(feeId) : undefined,
  );

  const merchants = useMerchantStore((s) => s.merchants);
  const addFee = useMerchantFeeStore((s) => s.addFee);
  const updateFee = useMerchantFeeStore((s) => s.updateFee);

  const numberString = (message: string) =>
    z
      .string()
      .min(1, message)
      .refine((v) => {
        const n = Number(v);
        return Number.isFinite(n);
      }, message);

  const schema = React.useMemo(
    () =>
      z.object({
        merchantId: z.string().min(1, t("validation.merchantRequired")),
        brand: z.string().min(1, t("validation.brandRequired")),
        paymentMethodType: z.enum(["card", "bank"]),
        mdrPercent: numberString(t("validation.mdrPercentMin"))
          .refine((v) => Number(v) >= 0, t("validation.mdrPercentMin"))
          .refine((v) => Number(v) <= 100, t("validation.mdrPercentMax")),
        fixedFee: numberString(t("validation.fixedFeeMin")).refine(
          (v) => Number(v) >= 0,
          t("validation.fixedFeeMin"),
        ),
        status: z.enum(["active", "suspended"]),
      }),
    [t],
  );

  const form = useForm<MerchantFeeUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: fee?.merchantId ?? "",
      brand: fee?.brand ?? "",
      paymentMethodType: (fee?.paymentMethodType ??
        "card") as PaymentMethodType,
      mdrPercent: String(fee?.mdrPercent ?? ""),
      fixedFee: String(fee?.fixedFee ?? ""),
      status: (fee?.status ?? "active") as MerchantFeeStatus,
    },
  });

  useEffect(() => {
    form.reset({
      merchantId: fee?.merchantId ?? "",
      brand: fee?.brand ?? "",
      paymentMethodType: (fee?.paymentMethodType ??
        "card") as PaymentMethodType,
      mdrPercent: String(fee?.mdrPercent ?? ""),
      fixedFee: String(fee?.fixedFee ?? ""),
      status: (fee?.status ?? "active") as MerchantFeeStatus,
    });
  }, [form, fee]);

  const onSubmit = form.handleSubmit((data) => {
    const mdrPercent = Number(data.mdrPercent);
    const fixedFee = Number(data.fixedFee);

    if (feeId) {
      updateFee(feeId, {
        merchantId: data.merchantId,
        brand: data.brand.trim(),
        paymentMethodType: data.paymentMethodType,
        mdrPercent,
        fixedFee,
        status: data.status,
      });
      router.push(`/${locale}/operator/merchant-fee`);
      return;
    }

    addFee({
      merchantId: data.merchantId,
      brand: data.brand.trim(),
      paymentMethodType: data.paymentMethodType,
      mdrPercent,
      fixedFee,
      status: data.status,
    });

    router.push(`/${locale}/operator/merchant-fee`);
  });

  const title = feeId ? t("form.editTitle") : t("form.createTitle");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="merchantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.merchantName")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectMerchant")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {merchants.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
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
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.brand")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.brandPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.paymentMethodType")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue
                            placeholder={t("form.selectPaymentMethodType")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_METHOD_OPTIONS.map((v) => (
                          <SelectItem key={v} value={v}>
                            {t(`paymentMethodTypes.${v}`)}
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
                name="mdrPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.mdrPercent")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("form.mdrPercentPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fixedFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.fixedFee")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("form.fixedFeePlaceholder")}
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

          <CardFooter className="mt-4 justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => router.push(`/${locale}/operator/merchant-fee`)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="submit"
              className="h-9 bg-indigo-600 hover:bg-indigo-700"
              disabled={form.formState.isSubmitting}
            >
              {t("buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
