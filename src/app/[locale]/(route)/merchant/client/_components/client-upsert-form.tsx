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
import { useMerchantClientStore } from "@/store/merchant/merchant-client-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ClientUpsertValues = {
  name: string;
  phoneNumber: string;
  email: string;
};

export default function ClientUpsertForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.Clients");

  const client = useMerchantClientStore((s) => s.getClientById(clientId));
  const updateClient = useMerchantClientStore((s) => s.updateClient);

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        phoneNumber: z.string().min(1, t("validation.phoneRequired")),
        email: z
          .string()
          .min(1, t("validation.emailRequired"))
          .email(t("validation.emailInvalid")),
      }),
    [t],
  );

  const form = useForm<ClientUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: client?.name ?? "",
      phoneNumber: client?.phoneNumber ?? "",
      email: client?.email ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: client?.name ?? "",
      phoneNumber: client?.phoneNumber ?? "",
      email: client?.email ?? "",
    });
  }, [form, client]);

  const onSubmit = form.handleSubmit((data) => {
    updateClient(clientId, {
      name: data.name.trim(),
      phoneNumber: data.phoneNumber.trim(),
      email: data.email.trim(),
    });
    router.push(`/${locale}/merchant/client`);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.editTitle")}</CardTitle>
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.phonePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button
              
              variant="outline"
              className="h-9"
              onClick={() => router.push(`/${locale}/merchant/client`)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="submit"
              className="h-9"
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
