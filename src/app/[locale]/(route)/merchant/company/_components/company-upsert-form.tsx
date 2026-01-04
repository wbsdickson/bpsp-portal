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
import type { Company } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMerchantCompanyStore } from "@/store/merchant/merchant-company-store";
import { Switch } from "@/components/ui/switch";

type MerchantCompanyUpsertValues = {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  invoiceEmail: string;
  websiteUrl: string;
  invoicePrefix: string;
  enableCreditPayment: boolean;
};

export default function MerchantCompanyUpsertForm({
  companyId,
  onSuccess,
}: {
  companyId?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.CompanyInformationManagement");

  const company = useMerchantCompanyStore((s) =>
    companyId ? s.getCompanyById(companyId) : undefined,
  );

  const addCompany = useMerchantCompanyStore((s) => s.addCompany);
  const updateCompany = useMerchantCompanyStore((s) => s.updateCompany);

  const schema = React.useMemo(
    () =>
      z.object({
        id: z.string().min(1, t("validation.idRequired")),
        name: z.string().min(1, t("validation.nameRequired")),
        address: z.string().min(1, t("validation.addressRequired")),
        phoneNumber: z.string().min(1, t("validation.phoneNumberRequired")),
        invoiceEmail: z.string().min(1, t("validation.invoiceEmailRequired")),
        websiteUrl: z.string().min(1, t("validation.websiteUrlRequired")),
        invoicePrefix: z.string().min(1, t("validation.invoicePrefixRequired")),
        enableCreditPayment: z.boolean(),
      }),
    [t],
  );
  const form = useForm<MerchantCompanyUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: company?.id ?? "",
      name: company?.name ?? "",
      address: company?.address ?? "",
      phoneNumber: company?.phoneNumber ?? "",
      invoiceEmail: company?.invoiceEmail ?? "",
      websiteUrl: company?.websiteUrl ?? "",
      invoicePrefix: company?.invoicePrefix ?? "",
      enableCreditPayment: company?.enableCreditPayment ?? false,
    },
  });

  useEffect(() => {
    form.reset({
      id: company?.id ?? "",
      name: company?.name ?? "",
      address: company?.address ?? "",
      phoneNumber: company?.phoneNumber ?? "",
      invoiceEmail: company?.invoiceEmail ?? "",
      websiteUrl: company?.websiteUrl ?? "",
      invoicePrefix: company?.invoicePrefix ?? "",
      enableCreditPayment: company?.enableCreditPayment ?? false,
    });
  }, [form, company]);

  const onSubmit = form.handleSubmit((data: MerchantCompanyUpsertValues) => {
    if (companyId) {
      updateCompany(companyId, {
        id: data.id,
        name: data.name.trim(),
        address: data.address.trim(),
        phoneNumber: data.phoneNumber.trim(),
        invoiceEmail: data.invoiceEmail.trim(),
        websiteUrl: data.websiteUrl?.trim() ?? "",
        invoicePrefix: data.invoicePrefix?.trim() ?? "",
        enableCreditPayment: data.enableCreditPayment,
      });
      if (onSuccess) onSuccess();
      return;
    }

    const newCompany: Company = {
      id: generateId("u"),
      name: data.name.trim(),
      address: data.address.trim(),
      phoneNumber: data.phoneNumber.trim(),
      invoiceEmail: data.invoiceEmail.trim(),
      websiteUrl: data.websiteUrl.trim(),
      invoicePrefix: data.invoicePrefix.trim(),
      enableCreditPayment: data.enableCreditPayment,
    };

    addCompany(newCompany);
    if (onSuccess) onSuccess();
  });

  const title = companyId ? t("form.editTitle") : t("form.createTitle");

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
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.id")} </FormLabel>
                    <FormControl>
                      <Input placeholder={t("form.idPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.address")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.addressPlaceholder")}
                        {...field}
                      />
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
                    <FormLabel>{t("columns.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.phoneNumberPlaceholder")}
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
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.websiteUrl")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.websiteUrlPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoicePrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.invoicePrefix")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.invoicePrefixPlaceholder")}
                        {...field}
                      />
                    </FormControl>
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
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
              onClick={() => {
                if (onSuccess) onSuccess();
                router.push(`/${locale}/merchant/company`);
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
