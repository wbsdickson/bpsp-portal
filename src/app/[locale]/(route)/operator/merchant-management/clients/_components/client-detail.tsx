"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useClientStore } from "@/store/client-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import Link from "next/link";
import { Pen, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InlineEditField } from "@/components/inline-edit-field";
import { toast } from "sonner";
import { TitleField } from "@/components/title-field";

export default function ClientDetail({ clientId }: { clientId: string }) {
  const t = useTranslations("Operator.Clients");
  const router = useRouter();
  const { basePath } = useBasePath();

  const client = useClientStore((s) => s.getClientById(clientId));
  const updateClient = useClientStore((s) => s.updateClient);

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        contactPerson: z.string().optional(),
        phoneNumber: z.string().min(1, t("validation.phoneRequired")),
        email: z
          .string()
          .min(1, t("validation.emailRequired"))
          .email(t("validation.emailInvalid")),
      }),
    [t],
  );

  type ClientDetailValues = z.infer<typeof schema>;

  const form = useForm<ClientDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: client?.name ?? "",
      contactPerson: client?.contactPerson ?? "",
      phoneNumber: client?.phoneNumber ?? "",
      email: client?.email ?? "",
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        contactPerson: client.contactPerson ?? "",
        phoneNumber: client.phoneNumber,
        email: client.email,
      });
    }
  }, [client, form, isEditing]);

  if (!client || client.deletedAt) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`${basePath}/clients`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateClient(clientId, {
      name: data.name,
      contactPerson: data.contactPerson?.trim() || undefined,
      phoneNumber: data.phoneNumber,
      email: data.email,
    });
    toast.success(t("messages.updateSuccess"));
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const registrationLabel = client.createdAt
    ? (() => {
        const dt = new Date(client.createdAt);
        return Number.isNaN(dt.getTime())
          ? client.createdAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{client.name}</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                size="xs"
                onClick={onCancel}
                title={t("buttons.cancel")}
              >
                Discard
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={onSubmit}
                title={t("buttons.save")}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setIsEditing(true)}
              title={t("actions.edit")}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="bg-card grid grid-cols-1 gap-6 rounded-md p-4 md:grid-cols-2">
            <InlineEditField
              control={form.control}
              name="name"
              label={t("columns.name")}
              isEditing={isEditing}
              value={client.name}
              renderInput={(field) => <Input {...field} />}
            />
            <InlineEditField
              control={form.control}
              name="contactPerson"
              label={t("columns.contactPerson")}
              isEditing={isEditing}
              value={client.contactPerson ?? "—"}
              renderInput={(field) => <Input {...field} />}
            />
            <InlineEditField
              control={form.control}
              name="phoneNumber"
              label={t("columns.phoneNumber")}
              isEditing={isEditing}
              value={client.phoneNumber}
              renderInput={(field) => <Input {...field} />}
            />
            <InlineEditField
              control={form.control}
              name="email"
              label={t("columns.email")}
              isEditing={isEditing}
              value={client.email}
              renderInput={(field) => <Input {...field} />}
            />
            <TitleField
              label={t("columns.registrationDate")}
              value={registrationLabel}
            />
            <TitleField
              label={t("columns.merchantId")}
              value={<div className="font-mono">{client.merchantId}</div>}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
