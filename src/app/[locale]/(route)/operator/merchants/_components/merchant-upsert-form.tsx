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
import { useMerchantStore } from "@/store/merchant-store";
import type { MerchantStatus } from "@/types/merchant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

type MerchantUpsertValues = {
  name: string;
  invoiceEmail: string;
  enableCreditPayment: boolean;
  status: MerchantStatus;
};

const STATUS_OPTIONS: MerchantStatus[] = ["active", "suspended"];

export default function MerchantUpsertForm({
  merchantId,
}: {
  merchantId?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Merchants");

  const merchant = useMerchantStore((s) =>
    merchantId ? s.getMerchantById(merchantId) : undefined,
  );

  const addMerchant = useMerchantStore((s) => s.addMerchant);
  const updateMerchant = useMerchantStore((s) => s.updateMerchant);

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        invoiceEmail: z
          .string()
          .min(1, t("validation.invoiceEmailRequired"))
          .email(t("validation.emailInvalid")),
        enableCreditPayment: z.boolean(),
        status: z.enum(["active", "suspended"]),
      }),
    [t],
  );

  const form = useForm<MerchantUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: merchant?.name ?? "",
      invoiceEmail: merchant?.invoiceEmail ?? "",
      enableCreditPayment: merchant?.enableCreditPayment ?? false,
      status: (merchant?.status ?? "active") as MerchantStatus,
    },
  });

  useEffect(() => {
    form.reset({
      name: merchant?.name ?? "",
      invoiceEmail: merchant?.invoiceEmail ?? "",
      enableCreditPayment: merchant?.enableCreditPayment ?? false,
      status: (merchant?.status ?? "active") as MerchantStatus,
    });
  }, [form, merchant]);

  const onSubmit = form.handleSubmit((data: MerchantUpsertValues) => {
    if (merchantId) {
      updateMerchant(merchantId, {
        name: data.name.trim(),
        invoiceEmail: data.invoiceEmail.trim(),
        enableCreditPayment: data.enableCreditPayment,
        status: data.status,
      });
      router.push("/operator/merchants");
      return;
    }

    addMerchant({
      name: data.name.trim(),
      invoiceEmail: data.invoiceEmail.trim(),
      enableCreditPayment: data.enableCreditPayment,
      status: data.status,
    });
    router.push("/operator/merchants");
  });

  const title = merchantId ? t("form.editTitle") : t("form.createTitle");

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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.namePlaceholder")}
                        {...field}
                      />
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
                name="enableCreditPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.enableCreditPayment")}</FormLabel>
                    <div className="flex h-9 items-center">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => {
                router.push(`/${locale}/operator/merchants`);
              }}
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
