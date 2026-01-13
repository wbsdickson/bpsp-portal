"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useMerchantCompanyStore } from "@/store/merchant/merchant-company-store";
import { useAppStore } from "@/lib/store";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  invoiceEmail: z.string().email("Please enter a valid email address"),
  websiteUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  invoicePrefix: z.string().optional(),
  enableCreditPayment: z.boolean(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanyInformationForm() {
  const t = useTranslations("Merchant.CompanyInformationManagement");
  const user = useAppStore((s) => s.users[0]);
  const companies = useMerchantCompanyStore((s) => s.companies);
  const updateCompany = useMerchantCompanyStore((s) => s.updateCompany);
  const addCompany = useMerchantCompanyStore((s) => s.addCompany);

  const currentCompany = React.useMemo(() => {
    if (!user?.merchantId) return null;
    return (
      companies.find((c) => c.createdBy === user.merchantId && !c.deletedAt) ||
      null
    );
  }, [companies, user?.merchantId]);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      invoiceEmail: "",
      websiteUrl: "",
      invoicePrefix: "",
      enableCreditPayment: false,
    },
  });

  React.useEffect(() => {
    if (currentCompany) {
      form.reset({
        name: currentCompany.name || "",
        address: currentCompany.address || "",
        phoneNumber: currentCompany.phoneNumber || "",
        invoiceEmail: currentCompany.invoiceEmail || "",
        websiteUrl: currentCompany.websiteUrl || "",
        invoicePrefix: currentCompany.invoicePrefix || "",
        enableCreditPayment: currentCompany.enableCreditPayment || false,
      });
    }
  }, [currentCompany, form]);

  const onSubmit = form.handleSubmit((data) => {
    if (!user?.merchantId) {
      toast.error("User not found");
      return;
    }

    try {
      if (currentCompany) {
        updateCompany(currentCompany.id, {
          ...data,
          updatedAt: new Date().toISOString(),
          updatedBy: user.id,
        });
        toast.success("Company information has been updated.");
      } else {
        const newCompany = {
          id: `company_${Date.now()}`,
          name: data.name,
          address: data.address || "",
          phoneNumber: data.phoneNumber || "",
          invoiceEmail: data.invoiceEmail,
          websiteUrl: data.websiteUrl || "",
          invoicePrefix: data.invoicePrefix || "",
          enableCreditPayment: data.enableCreditPayment,
          createdAt: new Date().toISOString(),
          createdBy: user.merchantId,
          updatedAt: new Date().toISOString(),
          updatedBy: user.id,
        };
        addCompany(newCompany);
        toast.success("Company information has been created.");
      }
    } catch (error) {
      toast.error("Failed to update company information.");
      console.error("Error updating company:", error);
    }
  });

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("columns.name")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.businessNamePlaceholder")}
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
                      <FormLabel>
                        {t("columns.invoiceEmail")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
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
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="enableCreditPayment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t("columns.enableCreditPayment")}
                      </FormLabel>
                      <div className="text-muted-foreground text-sm">
                        {t("form.enableCreditPaymentPlaceholder")}
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

              <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Saving..."
                    : t("buttons.save")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
