"use client";

import * as React from "react";

import HeaderPage from "@/components/header-page";
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
import { Switch } from "@/components/ui/switch";
import { useMerchantStore } from "@/store/merchant-store";
import { useTaxSettingsStore } from "@/store/tax-settings-store";
import type { TaxRoundingMethod } from "@/types/tax-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type TaxSettingsFormValues = {
  merchantId: string;
  taxable: boolean;
  taxRatePercent: string;
  roundingMethod: TaxRoundingMethod;
};

const ROUNDING_METHODS: TaxRoundingMethod[] = ["round", "floor", "ceil"];

export default function TaxSettingsPage() {
  const t = useTranslations("Operator.TaxSettings");

  const merchants = useMerchantStore((s) => s.merchants);
  const getByMerchantId = useTaxSettingsStore((s) => s.getByMerchantId);
  const upsert = useTaxSettingsStore((s) => s.upsert);

  const schema = React.useMemo(
    () =>
      z.object({
        merchantId: z.string().min(1, t("validation.merchantRequired")),
        taxable: z.boolean(),
        taxRatePercent: z
          .string()
          .min(1, t("validation.taxRateRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)),
            t("validation.taxRateInvalid"),
          )
          .refine((v) => Number(v) >= 0, t("validation.taxRateMin"))
          .refine((v) => Number(v) <= 100, t("validation.taxRateMax")),
        roundingMethod: z.enum(["round", "floor", "ceil"]),
      }),
    [t],
  );

  const form = useForm<TaxSettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: merchants[0]?.id ?? "",
      taxable: true,
      taxRatePercent: "10",
      roundingMethod: "round",
    },
  });

  const selectedMerchantId = form.watch("merchantId");

  useEffect(() => {
    if (!selectedMerchantId) return;

    const current = getByMerchantId(selectedMerchantId);
    form.reset({
      merchantId: selectedMerchantId,
      taxable: current?.taxable ?? true,
      taxRatePercent: String(((current?.taxRate ?? 0.1) * 100).toFixed(2)),
      roundingMethod: (current?.roundingMethod ?? "round") as TaxRoundingMethod,
    });
  }, [form, getByMerchantId, selectedMerchantId]);

  const onSubmit = form.handleSubmit((data) => {
    const rate = data.taxable ? Number(data.taxRatePercent) / 100 : 0;

    upsert({
      merchantId: data.merchantId,
      taxable: data.taxable,
      taxRate: rate,
      roundingMethod: data.roundingMethod,
    });
  });

  const currentSettings = selectedMerchantId
    ? getByMerchantId(selectedMerchantId)
    : undefined;

  const updatedAtLabel = currentSettings?.updatedAt
    ? (() => {
        const dt = new Date(currentSettings.updatedAt);
        return Number.isNaN(dt.getTime())
          ? currentSettings.updatedAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <HeaderPage title={t("title")}>
      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("form.title")}</CardTitle>
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
                        <FormLabel>{t("form.merchant")}</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue
                                placeholder={t("form.selectMerchant")}
                              />
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

                  <div className="md:col-span-2" />

                  <FormField
                    control={form.control}
                    name="taxable"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
                        <div>
                          <FormLabel>{t("form.taxable")}</FormLabel>
                          <div className="text-muted-foreground text-xs">
                            {t("form.taxableHelp")}
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxRatePercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.taxRate")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            inputMode="decimal"
                            className="h-9"
                            disabled={!form.watch("taxable")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roundingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.roundingMethod")}</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue
                                placeholder={t("form.selectRoundingMethod")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ROUNDING_METHODS.map((m) => (
                              <SelectItem key={m} value={m}>
                                {t(`roundingMethods.${m}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <div className="text-muted-foreground text-xs">
                      {t("form.updatedAt")}: {updatedAtLabel}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="justify-end gap-2">
                <Button
                  variant="outline"
                  className="h-9"
                  onClick={() => {
                    const current = selectedMerchantId
                      ? getByMerchantId(selectedMerchantId)
                      : undefined;
                    form.reset({
                      merchantId: selectedMerchantId,
                      taxable: current?.taxable ?? true,
                      taxRatePercent: String(
                        ((current?.taxRate ?? 0.1) * 100).toFixed(2),
                      ),
                      roundingMethod: (current?.roundingMethod ??
                        "round") as TaxRoundingMethod,
                    });
                  }}
                >
                  {t("buttons.reset")}
                </Button>
                <Button
                  type="submit"
                  className="h-9"
                  disabled={form.formState.isSubmitting}
                >
                  {t("buttons.save")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </HeaderPage>
  );
}
