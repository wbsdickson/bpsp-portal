"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { X } from "lucide-react";

import { useAppStore } from "@/lib/store";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useReceivedPayableInvoiceAutoIssuanceStore } from "@/store/merchant/rp-invoice-auto-issuance-store";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const schema = z.object({
  settingName: z.string().min(1),
  targetClient: z.string().min(1),
  issuanceCycle: z.enum(["daily", "weekly", "monthly"]),
  nextIssuanceDate: z.string().min(1),
  status: z.enum(["enabled", "disabled"]),
  direction: z.enum(["receivable", "payable"]),
  template: z.string().min(1),
  enabled: z.boolean().catch(false),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ReceivedPayableInvoiceUpsertPage({
  invoiceId,
}: {
  invoiceId?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.ReceivedPayableInvoiceAutoIssuance");
  const { basePath } = useBasePath();

  const clients = useAppStore((s) => s.clients);

  const addInvoice = useReceivedPayableInvoiceAutoIssuanceStore(
    (s) => s.addInvoice,
  );
  const updateInvoice = useReceivedPayableInvoiceAutoIssuanceStore(
    (s) => s.updateInvoice,
  );
  const invoiceToEdit = useReceivedPayableInvoiceAutoIssuanceStore((s) =>
    invoiceId ? s.getInvoiceById(invoiceId) : undefined,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nextIssuanceDate:
        invoiceToEdit?.nextIssuanceDate ??
        new Date().toISOString().split("T")[0]!,
      settingName: invoiceToEdit?.settingName ?? "",
      targetClient: invoiceToEdit?.targetClient ?? "",
      issuanceCycle: invoiceToEdit?.issuanceCycle ?? "daily",
      status: invoiceToEdit?.status ?? "enabled",
      direction: invoiceToEdit?.direction ?? "payable",
      template: invoiceToEdit?.template ?? "",
      enabled: invoiceToEdit?.enabled ?? true,
      notes: invoiceToEdit?.notes ?? "",
    },
  });

  React.useEffect(() => {
    if (!invoiceToEdit) return;
    form.reset({
      nextIssuanceDate: invoiceToEdit.nextIssuanceDate,
      settingName: invoiceToEdit.settingName,
      targetClient: invoiceToEdit.targetClient,
      issuanceCycle: invoiceToEdit.issuanceCycle,
      status: invoiceToEdit.status,
      direction: invoiceToEdit.direction,
      template: invoiceToEdit.template,
      enabled: invoiceToEdit.enabled,
    });
  }, [form, invoiceToEdit]);

  const onSubmit = form.handleSubmit((data) => {
    if (invoiceId) {
      updateInvoice(invoiceId, {
        nextIssuanceDate: data.nextIssuanceDate,
        settingName: data.settingName,
        targetClient: data.targetClient,
        issuanceCycle: data.issuanceCycle,
        status: data.status,
        direction: data.direction,
        template: data.template,
        enabled: data.enabled,
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      addInvoice({
        settingName: data.settingName,
        targetClient: data.targetClient,
        issuanceCycle: data.issuanceCycle,
        nextIssuanceDate: data.nextIssuanceDate,
        status: data.status,
        direction: data.direction,
        template: data.template,
        enabled: data.enabled,
      });
      toast.success(t("messages.createSuccess"));
    }

    router.push(`${basePath}?tab=table`);
  });

  return (
    <div className="bg-background min-h-[calc(100vh-0px)] rounded-lg p-4">
      <div className="bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href={`${basePath}?tab=table`}>
              <X className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex-1">
            <div className="text-xl font-bold">
              {invoiceId ? t("form.editTitle") : t("form.createTitle")}
            </div>
          </div>

          <Button size="sm" className="h-9" onClick={onSubmit}>
            {invoiceId ? t("buttons.saveChanges") : t("buttons.create")}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="mb-3 grid grid-cols-1 gap-3 space-y-3 md:grid-cols-2">
              <div className="max-w-sm">
                <FormField
                  control={form.control}
                  name="settingName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("form.settingName")}</FormLabel>
                      <FormControl>
                        <Input value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="max-w-sm">
                <FormField
                  control={form.control}
                  name="targetClient"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("form.targetClient")}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder={t("form.clientName")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 space-y-3 md:grid-cols-2">
              <div className="max-w-sm">
                <FormField
                  control={form.control}
                  name="issuanceCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.issuanceCycle")}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue
                                placeholder={t("form.issuanceCycle")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="max-w-sm">
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.template")}</FormLabel>
                      <FormControl>
                        <Input value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 space-y-3 md:grid-cols-2">
              <div className="max-w-sm">
                <FormField
                  control={form.control}
                  name="direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.direction")}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue placeholder={t("form.direction")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="receivable">
                              Receivable
                            </SelectItem>
                            <SelectItem value="payable">Payable</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="max-w-sm">
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.enabled")}</FormLabel>
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
            </div>
            <div className="max-w-sm">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.notes")}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-24" {...field} />
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
