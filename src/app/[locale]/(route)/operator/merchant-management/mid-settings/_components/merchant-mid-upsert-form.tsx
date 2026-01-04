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
import { DatePicker } from "@/components/ui/date-picker";
import { useMerchantMidStore } from "@/store/merchant-mid-store";
import { useMerchantStore } from "@/store/merchant-store";
import type { MerchantMidStatus } from "@/types/merchant-mid";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";
import { createMerchantMidSchema } from "../_lib/merchant-mid-schema";

const STATUS_OPTIONS: MerchantMidStatus[] = ["active", "inactive"];

export default function MerchantMidUpsertForm({
  midId,
  onCancel,
  onSuccess,
}: {
  midId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Operator.MerchantMIDs");
  const { basePath } = useBasePath();

  const mid = useMerchantMidStore((s) =>
    midId ? s.getMidById(midId) : undefined,
  );

  const merchants = useMerchantStore((s) => s.merchants);
  const addMid = useMerchantMidStore((s) => s.addMid);
  const updateMid = useMerchantMidStore((s) => s.updateMid);

  const schema = React.useMemo(() => createMerchantMidSchema(t), [t]);
  type MerchantMidUpsertValues = z.infer<typeof schema>;

  const form = useForm<MerchantMidUpsertValues>({
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
    const effectiveStartDate =
      mid?.effectiveStartDate ?? new Date().toISOString();
    const effectiveEndDate =
      mid?.effectiveEndDate ??
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    form.reset({
      merchantId: mid?.merchantId ?? "",
      mid: mid?.mid ?? "",
      brand: mid?.brand ?? "",
      status: (mid?.status ?? "active") as MerchantMidStatus,
      effectiveStartDate,
      effectiveEndDate,
    });
  }, [form, mid]);

  const onSubmit = form.handleSubmit((data) => {
    if (midId) {
      updateMid(midId, {
        merchantId: data.merchantId,
        mid: data.mid.trim(),
        brand: data.brand.trim(),
        status: data.status,
        effectiveStartDate: data.effectiveStartDate,
        effectiveEndDate: data.effectiveEndDate,
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      addMid({
        merchantId: data.merchantId,
        mid: data.mid.trim(),
        brand: data.brand.trim(),
        status: data.status,
        effectiveStartDate: data.effectiveStartDate,
        effectiveEndDate: data.effectiveEndDate,
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
            name="mid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("columns.mid")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.midPlaceholder")}
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

          <FormField
            control={form.control}
            name="effectiveStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.effectiveStartDate")}</FormLabel>
                <FormControl>
                  <DatePicker
                    id="effectiveStartDate"
                    label={null}
                    placeholder={t("form.effectiveStartDatePlaceholder")}
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(d) => field.onChange(d?.toISOString() ?? "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effectiveEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.effectiveEndDate")}</FormLabel>
                <FormControl>
                  <DatePicker
                    id="effectiveEndDate"
                    label={null}
                    placeholder={t("form.effectiveEndDatePlaceholder")}
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(d) => field.onChange(d?.toISOString() ?? "")}
                  />
                </FormControl>
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
