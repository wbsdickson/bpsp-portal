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

type MerchantMidUpsertValues = {
  merchantId: string;
  mid: string;
  brand: string;
  status: MerchantMidStatus;
  effectiveStartDate: string;
  effectiveEndDate: string;
};

const STATUS_OPTIONS: MerchantMidStatus[] = ["active", "inactive"];

export default function MerchantMidUpsertForm({ midId }: { midId?: string }) {
  const router = useRouter();
  const t = useTranslations("Operator.MerchantMIDs");

  const mid = useMerchantMidStore((s) =>
    midId ? s.getMidById(midId) : undefined,
  );

  const merchants = useMerchantStore((s) => s.merchants);
  const addMid = useMerchantMidStore((s) => s.addMid);
  const updateMid = useMerchantMidStore((s) => s.updateMid);
  const { basePath } = useBasePath();

  const schema = React.useMemo(
    () =>
      z.object({
        merchantId: z.string().min(1, t("validation.merchantRequired")),
        mid: z.string().min(1, t("validation.midRequired")),
        brand: z.string().min(1, t("validation.brandRequired")),
        status: z.enum(["active", "inactive"]),
        effectiveStartDate: z
          .string()
          .min(1, t("validation.effectiveStartDateRequired")),
        effectiveEndDate: z
          .string()
          .min(1, t("validation.effectiveEndDateRequired")),
      }),
    [t],
  );

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
      router.push(basePath);
      return;
    }

    addMid({
      merchantId: data.merchantId,
      mid: data.mid.trim(),
      brand: data.brand.trim(),
      status: data.status,
      effectiveStartDate: data.effectiveStartDate,
      effectiveEndDate: data.effectiveEndDate,
    });
    toast.success(t("messages.createSuccess"));
    router.push(basePath);
  });

  const title = midId ? t("form.editTitle") : t("form.createTitle");

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
                name="mid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.mid")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.midPlaceholder")}
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
          </CardContent>

          <CardFooter className="mt-4 justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => router.push(basePath)}
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
