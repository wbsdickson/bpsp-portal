"use client";

import * as React from "react";

import HeaderPage from "@/components/header-page";
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
import { Switch } from "@/components/ui/switch";
import { useMerchantStore } from "@/store/merchant-store";
import { useTaxSettingsStore } from "@/store/tax-settings-store";
import type { TaxRoundingMethod } from "@/types/tax-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { InlineEditField } from "@/components/inline-edit-field";
import { Card, CardContent } from "@/components/ui/card";

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

  const [isEditing, setIsEditing] = useState(false);

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
    toast.success(t("messages.updateSuccess"));
    setIsEditing(false);
  });

  const onCancel = () => {
    if (!selectedMerchantId) return;
    const current = getByMerchantId(selectedMerchantId);
    form.reset({
      merchantId: selectedMerchantId,
      taxable: current?.taxable ?? true,
      taxRatePercent: String(((current?.taxRate ?? 0.1) * 100).toFixed(2)),
      roundingMethod: (current?.roundingMethod ?? "round") as TaxRoundingMethod,
    });
    setIsEditing(false);
  };

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
    <HeaderPage title={t("title")} containerClassName="max-w-5xl">
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <Card>
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
                          disabled={isEditing}
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t("title")}</h3>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={onCancel}
                          type="button"
                        >
                          {t("buttons.cancel")}
                        </Button>
                        <Button variant="secondary" size="xs" type="submit">
                          {t("buttons.save")}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => setIsEditing(true)}
                        type="button"
                      >
                        {t("buttons.edit")}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InlineEditField
                    control={form.control}
                    name="taxable"
                    label={t("form.taxable")}
                    isEditing={isEditing}
                    value={
                      form.watch("taxable")
                        ? t("statuses.enabled")
                        : t("statuses.disabled")
                    }
                    renderInput={(field) => (
                      <div className="flex h-9 items-center">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  <div className="md:col-span-2" />

                  <InlineEditField
                    control={form.control}
                    name="taxRatePercent"
                    label={t("form.taxRate")}
                    isEditing={isEditing}
                    value={`${form.watch("taxRatePercent")}%`}
                    renderInput={(field) => (
                      <Input
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        className="h-9"
                        {...field}
                      />
                    )}
                  />

                  <InlineEditField
                    control={form.control}
                    name="roundingMethod"
                    label={t("form.roundingMethod")}
                    isEditing={isEditing}
                    value={t(`roundingMethods.${form.watch("roundingMethod")}`)}
                    renderInput={(field) => (
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
                    )}
                  />

                  <div className="md:col-span-2">
                    <div className="text-muted-foreground text-xs">
                      {t("form.updatedAt")}: {updatedAtLabel}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </HeaderPage>
  );
}
