"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

import { useAppStore } from "@/lib/store";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useInvoiceAutoIssuanceStore } from "@/store/merchant/invoice-auto-issuance-store";
import { useBasePath } from "@/hooks/use-base-path";
import { Pen, Check, X, Minus, Plus } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,

} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineEditField } from "@/components/inline-edit-field";
import { createInvoiceAutoIssuanceSchema } from "../_lib/merchant-invoice-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function InvoiceDetail({ id }: { id: string }) {
  const t = useTranslations("Merchant.InvoiceAutoIssuance");
  const { basePath } = useBasePath();
  const router = useRouter();

  const invoice = useInvoiceAutoIssuanceStore((s) =>
    id ? s.getAutoIssuanceById(id) : undefined,
  );
  const updateInvoice = useInvoiceAutoIssuanceStore(
    (s) => s.updateAutoIssuance,
  );
  const clients = useAppStore((s) => s.getMerchantClients);
  const merchants = useAppStore((s) => s.merchants);
  const taxes = useAppStore((s) => s.taxes);
  const getMerchantClients = useAppStore((s) => s.getMerchantClients);

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createInvoiceAutoIssuanceSchema(t), [t]);
  type InvoiceAutoIssuanceValues = z.infer<typeof schema>;

  const form = useForm<InvoiceAutoIssuanceValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      merchantId: invoice?.merchantId ?? "",
      targetClient: invoice?.targetClient ?? "",
      scheduleName: invoice?.scheduleName ?? "",
      issuanceFrequency: "daily",
      intervalValue: 1,
      nextIssuanceDate: new Date().toISOString(),
      enabled: false,
    },
  });

  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "items" as never,
  });

  const selectedMerchantId = useWatch({
    control: form.control,
    name: "merchantId",
  });

  const availableClients = React.useMemo(
    () => getMerchantClients(selectedMerchantId),
    [getMerchantClients, selectedMerchantId],
  );

  useEffect(() => {
    if (invoice) {
      form.reset({
        merchantId: invoice.merchantId,
        targetClient: invoice.targetClient,
        issuanceFrequency: "daily",
        intervalValue: 1,
        nextIssuanceDate: new Date().toISOString(),
        enabled: false,
      });
    }
  }, [invoice, form]);

  const taxById = React.useMemo(() => {
    const map = new Map<string, string>();
    (taxes ?? []).forEach((tx) => map.set(tx.id, tx.name));
    return map;
  }, [taxes]);

  if (!invoice) {
    return (
      <div className="text-muted-foreground p-4 text-sm">{t("notFound")}</div>
    );
  }

  console.log(invoice);

  const merchant = merchants.find((m) => m.id === invoice.merchantId);

  const onSubmit = form.handleSubmit((data) => {
    updateInvoice(id, {
      ...data,
    });
    setIsEditing(false);
    toast.success(t("messages.updateSuccess"));
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {invoice.scheduleName}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {invoice.enabled === false && (
                <Badge
                  variant="secondary"
                  className="bg-indigo-50 text-indigo-700"
                >
                  {t("statusDraft")}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSubmit}
                className="text-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => {
                router.push(`${basePath}/edit/${invoice.id}`);
              }}
              title={t("actions.edit")}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="bg-card rounded-md p-4">
          <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InlineEditField
                control={form.control}
                name="scheduleName"
                label={t("scheduleName")}
                isEditing={isEditing}
                value={invoice.scheduleName}
                renderInput={(field) => <Input {...field} className="h-9" />}
              />
              <InlineEditField
                control={form.control}
                name="targetClient"
                label={t("targetClient")}
                isEditing={isEditing}
                value={invoice.targetClient}
                renderInput={(field) => <Input {...field} className="h-9" />}
              />
              <InlineEditField
                control={form.control}
                name="issuanceFrequency"
                label={t("issuanceFrequency")}
                isEditing={isEditing}
                value={invoice.issuanceFrequency}
                renderInput={(field) => <Input {...field} className="h-9" />}
              />
              <InlineEditField
                control={form.control}
                name="intervalValue"
                label={t("intervalValue")}
                isEditing={isEditing}
                value={invoice.intervalValue}
                renderInput={(field) => <Input {...field} className="h-9" />}
              />
              <InlineEditField
                control={form.control}
                name="nextIssuanceDate"
                label={t("nextIssuanceDate")}
                isEditing={isEditing}
                value={invoice.nextIssuanceDate}
                renderInput={(field) => <Input {...field} className="h-9" />}
              />
              <InlineEditField
                control={form.control}
                name="enabled"
                label={t("enabledStatus")}
                isEditing={isEditing}
                value={invoice.enabled ? t("enabled") : t("disabled")}
                renderInput={(field) => <Input {...field} className="h-9" />}
              />

              <InlineEditField
                control={form.control}
                name="merchantId"
                label={t("merchant")}
                isEditing={isEditing}
                value={merchant?.name ?? "—"}
                renderInput={(field) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {merchants.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
