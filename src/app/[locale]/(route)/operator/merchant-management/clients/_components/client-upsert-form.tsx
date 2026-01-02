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
import { Textarea } from "@/components/ui/textarea";
import { useClientStore } from "@/store/client-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";

type ClientUpsertValues = {
  name: string;
  address: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  memo: string;
};

export default function ClientUpsertForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const t = useTranslations("Operator.Clients");

  const client = useClientStore((s) => s.getClientById(clientId));

  const updateClient = useClientStore((s) => s.updateClient);

  const { basePath } = useBasePath();

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        address: z.string(),
        contactPerson: z.string(),
        phoneNumber: z.string().min(1, t("validation.phoneRequired")),
        email: z
          .string()
          .min(1, t("validation.emailRequired"))
          .email(t("validation.emailInvalid")),
        memo: z.string(),
      }),
    [t],
  );

  type ClientUpsertValues = z.infer<typeof schema>;

  const form = useForm<ClientUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: client?.name ?? "",
      address: client?.address ?? "",
      contactPerson: client?.contactPerson ?? "",
      phoneNumber: client?.phoneNumber ?? "",
      email: client?.email ?? "",
      memo: client?.memo ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: client?.name ?? "",
      address: client?.address ?? "",
      contactPerson: client?.contactPerson ?? "",
      phoneNumber: client?.phoneNumber ?? "",
      email: client?.email ?? "",
      memo: client?.memo ?? "",
    });
  }, [form, client]);

  const onSubmit = form.handleSubmit((data) => {
    updateClient(clientId, {
      name: data.name.trim(),
      address: data.address.trim() || undefined,
      contactPerson: data.contactPerson.trim() || undefined,
      phoneNumber: data.phoneNumber.trim(),
      email: data.email.trim(),
      memo: data.memo.trim() || undefined,
    });
    toast.success(t("messages.updateSuccess"));
    router.push(basePath);
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact person</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
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

              <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Memo</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} />
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
