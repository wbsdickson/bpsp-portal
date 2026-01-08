"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useMerchantStore } from "@/store/merchant-store";
import { useTranslations } from "next-intl";
import { Pen, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type MerchantFeeStatus,
  type PaymentMethodType,
} from "@/types/merchant-fee";
import { InlineEditField } from "@/components/inline-edit-field";
import { createMerchantFeeSchema } from "../_lib/merchant-fee-schema";

const STATUS_OPTIONS: MerchantFeeStatus[] = ["active", "suspended"];
const PAYMENT_METHOD_OPTIONS: PaymentMethodType[] = ["card", "bank"];

export default function MerchantFeeDetail({ feeId }: { feeId: string }) {
  const t = useTranslations("Operator.MerchantFees");

  const fee = useMerchantFeeStore((s) => s.getFeeById(feeId));
  const merchant = useMerchantStore((s) =>
    fee?.merchantId ? s.getMerchantById(fee.merchantId) : undefined,
  );
  const updateFee = useMerchantFeeStore((s) => s.updateFee);

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createMerchantFeeSchema(t), [t]);
  type FeeDetailValues = z.infer<typeof schema>;

  const form = useForm<FeeDetailValues>({
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
    if (fee) {
      form.reset({
        merchantId: fee.merchantId,
        brand: fee.brand,
        paymentMethodType: fee.paymentMethodType,
        mdrPercent: String(fee.mdrPercent),
        fixedFee: String(fee.fixedFee),
        status: (fee.status ?? "active") as MerchantFeeStatus,
      });
    }
  }, [fee, form, isEditing]);

  if (!fee) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        {t("messages.notFound")}
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateFee(feeId, {
      merchantId: data.merchantId,
      brand: data.brand,
      paymentMethodType: data.paymentMethodType,
      mdrPercent: Number(data.mdrPercent),
      fixedFee: Number(data.fixedFee),
      status: data.status,
    });
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const registrationLabel = fee.createdAt
    ? (() => {
        const dt = new Date(fee.createdAt);
        return Number.isNaN(dt.getTime()) ? fee.createdAt : dt.toLocaleString();
      })()
    : "—";

  const updatedLabel = fee.updatedAt
    ? (() => {
        const dt = new Date(fee.updatedAt);
        return Number.isNaN(dt.getTime()) ? fee.updatedAt : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {merchant?.name ?? fee.merchantId}
          </h2>
          <p className="text-muted-foreground text-sm">{fee.brand}</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                size="xs"
                onClick={onCancel}
                title={t("buttons.cancel")}
              >
                Discard
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={onSubmit}
                title={t("buttons.save")}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setIsEditing(true)}
              title={t("actions.edit")}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="bg-card grid grid-cols-1 gap-6 rounded-md p-4 md:grid-cols-2">
            <InlineEditField
              control={form.control}
              name="merchantId"
              label={t("columns.merchantName")}
              isEditing={false} // Read-only
              value={merchant?.name ?? "—"}
              renderInput={(field) => (
                <Input {...field} disabled className="h-9" />
              )}
            />

            <InlineEditField
              control={form.control}
              name="brand"
              label={t("columns.brand")}
              isEditing={isEditing}
              value={fee.brand}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="paymentMethodType"
              label={t("columns.paymentMethodType")}
              isEditing={isEditing}
              value={t(`paymentMethodTypes.${fee.paymentMethodType}`)}
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHOD_OPTIONS.map((v) => (
                      <SelectItem key={v} value={v}>
                        {t(`paymentMethodTypes.${v}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <InlineEditField
              control={form.control}
              name="status"
              label={t("columns.status")}
              isEditing={isEditing}
              value={t(`statuses.${fee.status ?? "active"}`)}
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`statuses.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <InlineEditField
              control={form.control}
              name="mdrPercent"
              label={t("columns.mdrPercent")}
              isEditing={isEditing}
              value={`${fee.mdrPercent.toFixed(2)}%`}
              renderInput={(field) => (
                <Input {...field} type="number" step="0.01" className="h-9" />
              )}
            />

            <InlineEditField
              control={form.control}
              name="fixedFee"
              label={t("columns.fixedFee")}
              isEditing={isEditing}
              value={fee.fixedFee.toFixed(2)}
              renderInput={(field) => (
                <Input {...field} type="number" step="0.01" className="h-9" />
              )}
            />

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.registrationDate")}
              </div>
              <div className="flex h-9 items-center text-sm font-medium">
                {registrationLabel}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.lastUpdatedDate")}
              </div>
              <div className="flex h-9 items-center text-sm font-medium">
                {updatedLabel}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
