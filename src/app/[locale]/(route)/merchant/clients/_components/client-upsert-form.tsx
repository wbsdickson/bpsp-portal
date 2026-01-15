"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";

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
import { useMerchantClientStore } from "@/store/merchant/merchant-client-store";
import { useBasePath } from "@/hooks/use-base-path";

type ClientUpsertValues = {
  name: string;
  phoneNumber: string;
  email: string;
  address?: string;
};

export default function ClientUpsertForm({
  clientId,
}: {
  clientId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Merchant.Clients");
  const { basePath } = useBasePath();

  const client = useMerchantClientStore((s) =>
    clientId ? s.getClientById(clientId) : undefined,
  );
  const updateClient = useMerchantClientStore((s) => s.updateClient);
  const addClient = useMerchantClientStore((s) => s.addClient);

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        phoneNumber: z.string().min(1, t("validation.phoneRequired")),
        email: z
          .string()
          .min(1, t("validation.emailRequired"))
          .email(t("validation.emailInvalid")),
        address: z.string().optional(),
      }),
    [t],
  );

  const form = useForm<ClientUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: client?.name ?? "",
      phoneNumber: client?.phoneNumber ?? "",
      email: client?.email ?? "",
      address: client?.address ?? "",
    },
  });

  useEffect(() => {
    if (!client) return;

    form.reset({
      name: client.name ?? "",
      phoneNumber: client.phoneNumber ?? "",
      email: client.email ?? "",
      address: client.address ?? "",
    });
  }, [form, client]);

  const onSubmit = form.handleSubmit((data) => {
    if (clientId) {
      updateClient(clientId, {
        name: data.name.trim(),
        phoneNumber: data.phoneNumber.trim(),
        email: data.email.trim(),
        address: data.address?.trim() || undefined,
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      addClient({
        name: data.name.trim(),
        phoneNumber: data.phoneNumber.trim(),
        email: data.email.trim(),
        address: data.address?.trim() || undefined,
      } as any);
      toast.success(t("messages.createSuccess"));
    }

    router.push(basePath);
  });

  return (
    <div className="bg-card min-h-[calc(100vh-0px)] rounded-lg p-4">
      <div className="bg-card/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
            <X className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <div className="text-xl font-bold">
              {clientId ? t("form.editTitle") : t("form.createTitle")}
            </div>
          </div>

          <Button
            size="sm"
            className="h-9"
            onClick={onSubmit}
            disabled={form.formState.isSubmitting}
          >
            {clientId ? t("buttons.save") : t("buttons.create")}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.phonePlaceholder")}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.emailPlaceholder")}
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.address")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.addressPlaceholder")}
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


          </form>
        </Form>
      </div>
    </div>
  );
}
