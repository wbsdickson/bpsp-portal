"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
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
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";
import { createMerchantFeeSchema } from "../_lib/merchant-fee-schema";

const STATUS_OPTIONS: MerchantFeeStatus[] = ["active", "suspended"];
const PAYMENT_METHOD_OPTIONS: PaymentMethodType[] = ["card", "bank"];

export default function MerchantFeeUpsertForm({
  feeId,
  onCancel,
  onSuccess,
}: {
  feeId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Operator.MerchantFees");
  const { basePath } = useBasePath();

  const fee = useMerchantFeeStore((s) =>
    feeId ? s.getFeeById(feeId) : undefined,
  );

  const merchants = useMerchantStore((s) => s.merchants);
  const addFee = useMerchantFeeStore((s) => s.addFee);
  const updateFee = useMerchantFeeStore((s) => s.updateFee);

  const schema = React.useMemo(() => createMerchantFeeSchema(t), [t]);
  type MerchantFeeUpsertValues = z.infer<typeof schema>;

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
      toast.success(t("messages.updateSuccess"));
    } else {
      addFee({
        merchantId: data.merchantId,
        brand: data.brand.trim(),
        paymentMethodType: data.paymentMethodType,
        mdrPercent,
        fixedFee,
        status: data.status,
      });
      toast.success(t("messages.createSuccess"));
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push(basePath);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
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
                    className="h-9"
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
                    className="h-9"
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
                    className="h-9"
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

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={onCancel}
            >
              {t("buttons.cancel")}
            </Button>
          )}
          <Button
            type="submit"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            disabled={form.formState.isSubmitting}
          >
            {t("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
