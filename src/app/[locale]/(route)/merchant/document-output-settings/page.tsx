"use client";

import * as React from "react";
import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
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
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useDocumentSettingsStore } from "@/store/merchant/document-settings-store";
import { useAppStore } from "@/lib/store";

const MAX_FOOTER_LENGTH = 1000;

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  representativeName: z.string().optional(),
  logo: z.any().optional(),
  footerText: z
    .string()
    .max(MAX_FOOTER_LENGTH, `Max ${MAX_FOOTER_LENGTH} chars`)
    .optional(),
});

type FormValues = z.infer<typeof schema>;

export default function DocumentOutputSettingsPage() {
  const t = useTranslations("Merchant.DocumentOutputSettings");
  const documentSettings = useDocumentSettingsStore((s) => s.settings);
  const currentUser = useAppStore.getState().currentUser;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      address: "",
      phoneNumber: "",
      representativeName: "",
      logo: undefined,
      footerText: "",
    },
  });

  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        toast.error("Invalid image format.");
        form.setValue("logo", undefined);
        setLogoPreview(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB.");
        form.setValue("logo", undefined);
        setLogoPreview(null);
        return;
      }
      form.setValue("logo", file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
      form.setValue("logo", undefined);
    }
  };

  const onSubmit = form.handleSubmit((values) => {
    const documentSetting = documentSettings.find(
      (s) => s.merchantId === currentUser?.id,
    );
    if (documentSetting) {
      useDocumentSettingsStore
        .getState()
        .upsert({ ...documentSetting, ...values });
    }
    toast.success(t("messages.updateSuccess"));
  });

  return (
    <HeaderPage title={t("title") || "Document Output Settings"}>
      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {t("form.title") || "Edit Document Output Settings"}
            </CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.companyName") || "Company Name (Print Name)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              t("form.companyNamePlaceholder") || "Company Name"
                            }
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
                        <FormLabel>{t("form.address") || "Address"}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              t("form.addressPlaceholder") || "Address"
                            }
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
                        <FormLabel>
                          {t("form.phoneNumber") || "Phone Number"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              t("form.phoneNumberPlaceholder") || "Phone Number"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="representativeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.representativeName") ||
                            "Representative Name"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              t("form.representativeNamePlaceholder") ||
                              "Representative Name"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.logo") || "Logo Image"}</FormLabel>
                        <FormControl>
                          <>
                            <input
                              type="file"
                              accept="image/png,image/jpeg"
                              ref={fileRef}
                              onChange={handleLogoChange}
                              style={{ display: "none" }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={() => fileRef.current?.click()}
                            >
                              {t("form.logoUploadButton") || "Upload Logo"}
                            </Button>
                            {logoPreview && (
                              <img
                                src={logoPreview}
                                alt="Logo Preview"
                                className="mt-2 max-h-24 rounded border"
                              />
                            )}
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="footerText"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>
                          {t("form.footerText") || "Footer Text"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              t("form.footerTextPlaceholder") ||
                              "Footer Text (max 1,000 chars)"
                            }
                            maxLength={MAX_FOOTER_LENGTH}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>

              <CardFooter className="justify-end gap-2 p-6">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9"
                  onClick={() => form.reset()}
                >
                  {t("buttons.reset") || "Reset"}
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-indigo-600 hover:bg-indigo-700"
                  disabled={form.formState.isSubmitting}
                >
                  {t("buttons.save") || "Save"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </HeaderPage>
  );
}
