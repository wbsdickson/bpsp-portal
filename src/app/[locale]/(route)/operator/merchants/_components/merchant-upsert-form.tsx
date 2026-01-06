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
import { Switch } from "@/components/ui/switch";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useMerchantStore } from "@/store/merchant-store";
import type { MerchantStatus } from "@/types/merchant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";

const STATUS_OPTIONS: MerchantStatus[] = ["active", "suspended"];

export default function MerchantUpsertForm({
  merchantId,
  onSuccess,
  onCancel,
}: {
  merchantId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Merchants");
  const { basePath } = useBasePath();

  const merchant = useMerchantStore((s) =>
    merchantId ? s.getMerchantById(merchantId) : undefined,
  );

  const addMerchant = useMerchantStore((s) => s.addMerchant);
  const updateMerchant = useMerchantStore((s) => s.updateMerchant);

  const fees = useMerchantFeeStore((s) => s.fees);
  const addFee = useMerchantFeeStore((s) => s.addFee);
  const updateFee = useMerchantFeeStore((s) => s.updateFee);
  const activeFee = React.useMemo(() => {
    if (!merchantId) return undefined;
    return (
      fees.find((f) => f.merchantId === merchantId && f.status === "active") ??
      fees.find((f) => f.merchantId === merchantId)
    );
  }, [fees, merchantId]);

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        address: z.string(),
        phoneNumber: z.string(),
        invoiceEmail: z
          .string()
          .min(1, t("validation.invoiceEmailRequired"))
          .email(t("validation.emailInvalid")),
        feeRatePercent: z.string().refine(
          (val) => {
            const trimmed = val.trim();
            if (!trimmed) return true;
            const num = Number(trimmed);
            return Number.isFinite(num) && num >= 0 && num <= 100;
          },
          { message: "Invalid fee rate" },
        ),
        status: z.enum(["active", "suspended"]),
      }),
    [t],
  );

  type MerchantUpsertValues = z.infer<typeof schema>;

  const form = useForm<MerchantUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: merchant?.name ?? "",
      address: merchant?.address ?? "",
      phoneNumber: merchant?.phoneNumber ?? "",
      invoiceEmail: merchant?.invoiceEmail ?? "",
      feeRatePercent:
        activeFee?.mdrPercent != null ? String(activeFee.mdrPercent) : "",
      status: (merchant?.status ?? "active") as MerchantStatus,
    },
  });

  useEffect(() => {
    form.reset({
      name: merchant?.name ?? "",
      address: merchant?.address ?? "",
      phoneNumber: merchant?.phoneNumber ?? "",
      invoiceEmail: merchant?.invoiceEmail ?? "",
      feeRatePercent:
        activeFee?.mdrPercent != null ? String(activeFee.mdrPercent) : "",
      status: (merchant?.status ?? "active") as MerchantStatus,
    });
  }, [form, merchant, activeFee]);

  const onSubmit = form.handleSubmit((data) => {
    const feeRateTrimmed = data.feeRatePercent.trim();
    const feeRateNumber = feeRateTrimmed ? Number(feeRateTrimmed) : undefined;

    if (merchantId) {
      updateMerchant(merchantId, {
        name: data.name.trim(),
        address: data.address.trim() || undefined,
        phoneNumber: data.phoneNumber.trim() || undefined,
        invoiceEmail: data.invoiceEmail.trim(),
        status: data.status,
      });

      if (feeRateNumber != null && Number.isFinite(feeRateNumber)) {
        if (activeFee) {
          updateFee(activeFee.id, { mdrPercent: feeRateNumber });
        } else {
          addFee({
            merchantId,
            brand: "VISA",
            paymentMethodType: "card",
            mdrPercent: feeRateNumber,
            fixedFee: 0,
            status: "active",
          });
        }
      }
      toast.success(t("messages.updateSuccess"));
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(basePath);
      }
      return;
    }

    const newMerchantId = addMerchant({
      name: data.name.trim(),
      address: data.address.trim() || undefined,
      phoneNumber: data.phoneNumber.trim() || undefined,
      invoiceEmail: data.invoiceEmail.trim(),
      status: data.status,
    });

    if (feeRateNumber != null && Number.isFinite(feeRateNumber)) {
      addFee({
        merchantId: newMerchantId,
        brand: "VISA",
        paymentMethodType: "card",
        mdrPercent: feeRateNumber,
        fixedFee: 0,
        status: "active",
      });
    }

    toast.success(t("messages.createSuccess"));
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(basePath);
    }
  });

  const title = merchantId ? t("form.editTitle") : t("form.createTitle");

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("columns.name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.namePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("columns.invoiceEmail")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.invoiceEmailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feeRatePercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee rate (%)</FormLabel>
                <FormControl>
                  <Input placeholder="" inputMode="decimal" {...field} />
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
        <div className="mt-4 flex justify-end gap-2">
          {(onCancel || !merchantId) && (
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => {
                if (onCancel) {
                  onCancel();
                } else {
                  router.push(basePath);
                }
              }}
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
