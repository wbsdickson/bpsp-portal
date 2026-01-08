"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { useAppStore } from "@/lib/store";
import { useInvoiceAutoIssuanceStore } from "@/store/merchant/invoice-auto-issuance-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createInvoiceAutoIssuanceSchema } from "../_lib/merchant-invoice-schema";
import { toast } from "sonner";
import { z } from "zod";

interface InvoiceAutoIssuanceUpsertFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  autoIssuanceId?: string;
}

const ISSUANCE_FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const;

type InvoiceAutoIssuanceValues = z.infer<
  ReturnType<typeof createInvoiceAutoIssuanceSchema>
>;

export function InvoiceAutoIssuanceUpsertForm({
  onCancel,
  onSuccess,
  autoIssuanceId,
}: InvoiceAutoIssuanceUpsertFormProps) {
  const t = useTranslations("Merchant.InvoiceAutoIssuance");
  const merchants = useAppStore((s) => s.merchants);
  const clients = useAppStore((s) => s.clients);
  const { addAutoIssuance, updateAutoIssuance, getAutoIssuanceById } =
    useInvoiceAutoIssuanceStore();

  const editing = autoIssuanceId
    ? getAutoIssuanceById(autoIssuanceId)
    : undefined;

  const schema = React.useMemo(() => createInvoiceAutoIssuanceSchema(t), [t]);

  const defaultValues: InvoiceAutoIssuanceValues = {
    merchantId: editing?.merchantId || merchants[0]?.id || "",
    targetClient: editing?.targetClient || "",
    issuanceFrequency: ISSUANCE_FREQUENCIES.includes(
      editing?.issuanceFrequency as any,
    )
      ? (editing?.issuanceFrequency as InvoiceAutoIssuanceValues["issuanceFrequency"])
      : "monthly",
    intervalValue:
      typeof editing?.intervalValue === "number" ? editing.intervalValue : 1,
    scheduleName: editing?.scheduleName || "",
    nextIssuanceDate: editing?.nextIssuanceDate
      ? editing.nextIssuanceDate.substring(0, 10)
      : new Date().toISOString().substring(0, 10),
    enabled: typeof editing?.enabled === "boolean" ? editing.enabled : false,
  };

  const form = useForm<InvoiceAutoIssuanceValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  const handleSubmit = (values: InvoiceAutoIssuanceValues) => {
    try {
      if (autoIssuanceId) {
        updateAutoIssuance(autoIssuanceId, values);
        toast.success(t("messages.updateSuccess"));
      } else {
        addAutoIssuance({ ...values });
        toast.success(t("messages.createSuccess"));
      }
      onSuccess();
    } catch (error) {
      toast.error(t("messages.error"));
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="merchantId"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-xs font-semibold">
                  {t("merchant")}
                </div>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={t("selectMerchant")} />
                    </SelectTrigger>
                    <SelectContent>
                      {merchants.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetClient"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-xs font-semibold">
                  {t("targetClient")}
                </div>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={t("selectClient")} />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="scheduleName"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-xs font-semibold">
                  {t("scheduleName")}
                </div>
                <FormControl>
                  <Input {...field} className="h-9" maxLength={40} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="issuanceFrequency"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-xs font-semibold">
                  {t("issuanceFrequency")}
                </div>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{t("freqDaily")}</SelectItem>
                      <SelectItem value="weekly">{t("freqWeekly")}</SelectItem>
                      <SelectItem value="monthly">
                        {t("freqMonthly")}
                      </SelectItem>
                      <SelectItem value="yearly">{t("freqYearly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="intervalValue"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-xs font-semibold">
                  {t("intervalValue")}
                </div>
                <FormControl>
                  <Input
                    {...field}
                    className="h-9"
                    type="number"
                    min={1}
                    max={365}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nextIssuanceDate"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-xs font-semibold">
                  {t("nextIssuanceDate")}
                </div>
                <FormControl>
                  <Input {...field} className="h-9" type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-xs font-semibold">
                  {t("enabledStatus")}
                </div>
                <FormControl>
                  <Select
                    value={field.value ? "enabled" : "disabled"}
                    onValueChange={(v) => field.onChange(v === "enabled")}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">{t("enabled")}</SelectItem>
                      <SelectItem value="disabled">{t("disabled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button  variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="submit">{t("save")}</Button>
        </div>
      </form>
    </Form>
  );
}
