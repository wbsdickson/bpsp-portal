"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useMerchantStore } from "@/store/merchant-store";
import { useMerchantMidStore } from "@/store/merchant-mid-store";
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
import { DatePicker } from "@/components/ui/date-picker";
import { type MerchantMidStatus } from "@/types/merchant-mid";
import { InlineEditField } from "@/components/inline-edit-field";
import { createMerchantMidSchema } from "../_lib/merchant-mid-schema";

const STATUS_OPTIONS: MerchantMidStatus[] = ["active", "inactive"];

export default function MerchantMidDetail({ midId }: { midId: string }) {
  const t = useTranslations("Operator.MerchantMIDs");
  const mid = useMerchantMidStore((s) => s.getMidById(midId));
  const merchant = useMerchantStore((s) =>
    mid?.merchantId ? s.getMerchantById(mid.merchantId) : undefined,
  );
  const updateMid = useMerchantMidStore((s) => s.updateMid);
  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createMerchantMidSchema(t), [t]);
  type MidDetailValues = z.infer<typeof schema>;

  const form = useForm<MidDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: mid?.merchantId ?? "",
      mid: mid?.mid ?? "",
      brand: mid?.brand ?? "",
      status: (mid?.status ?? "active") as MerchantMidStatus,
      effectiveStartDate: mid?.effectiveStartDate ?? "",
      effectiveEndDate: mid?.effectiveEndDate ?? "",
    },
  });

  useEffect(() => {
    if (mid) {
      form.reset({
        merchantId: mid.merchantId,
        mid: mid.mid,
        brand: mid.brand,
        status: (mid.status ?? "active") as MerchantMidStatus,
        effectiveStartDate: mid.effectiveStartDate,
        effectiveEndDate: mid.effectiveEndDate,
      });
    }
  }, [mid, form, isEditing]);

  if (!mid) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        {t("messages.notFound")}
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateMid(midId, {
      merchantId: data.merchantId,
      mid: data.mid,
      brand: data.brand,
      status: data.status,
      effectiveStartDate: data.effectiveStartDate,
      effectiveEndDate: data.effectiveEndDate,
    });
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const registrationLabel = mid.createdAt
    ? (() => {
        const dt = new Date(mid.createdAt);
        return Number.isNaN(dt.getTime()) ? mid.createdAt : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{mid.mid}</h2>
          <p className="text-muted-foreground text-sm">{mid.brand}</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                title={t("buttons.cancel")}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSubmit}
                title={t("buttons.save")}
                className="text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              title={t("actions.edit")}
            >
              <Pen className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InlineEditField
              control={form.control}
              name="mid"
              label={t("columns.mid")}
              isEditing={isEditing}
              value={mid.mid}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="brand"
              label={t("columns.brand")}
              isEditing={isEditing}
              value={mid.brand}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="status"
              label={t("columns.status")}
              isEditing={isEditing}
              value={t(`statuses.${mid.status ?? "active"}`)}
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
              name="merchantId"
              label={t("columns.merchantName")}
              isEditing={false} // Keeping read-only for now as per MemberDetail decision
              value={merchant?.name ?? "—"}
              renderInput={(field) => (
                <Input {...field} disabled className="h-9" />
              )}
            />

            <InlineEditField
              control={form.control}
              name="effectiveStartDate"
              label={t("form.effectiveStartDate")}
              isEditing={isEditing}
              value={
                mid.effectiveStartDate
                  ? new Date(mid.effectiveStartDate).toLocaleDateString()
                  : "—"
              }
              renderInput={(field) => (
                <DatePicker
                  id="effectiveStartDate"
                  label={null}
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(d) => field.onChange(d?.toISOString() ?? "")}
                />
              )}
            />

            <InlineEditField
              control={form.control}
              name="effectiveEndDate"
              label={t("form.effectiveEndDate")}
              isEditing={isEditing}
              value={
                mid.effectiveEndDate
                  ? new Date(mid.effectiveEndDate).toLocaleDateString()
                  : "—"
              }
              renderInput={(field) => (
                <DatePicker
                  id="effectiveEndDate"
                  label={null}
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(d) => field.onChange(d?.toISOString() ?? "")}
                />
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
          </div>
        </form>
      </Form>
    </div>
  );
}
