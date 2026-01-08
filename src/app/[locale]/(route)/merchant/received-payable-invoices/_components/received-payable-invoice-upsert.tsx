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

import { useReceivedInvoiceStore } from "@/store/merchant/received-invoice-store";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";

const schema = z.object({
  invoiceDate: z.string().min(1),
  dueDate: z.string().optional(),
  clientId: z.string().min(1),
  amount: z.number().min(0),
  uploadedPdfName: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.string().optional(),
  direction: z.enum(["receivable", "payable"]),
});

type FormValues = z.infer<typeof schema>;

export function ReceivedPayableInvoiceUpsertPage({
  invoiceId,
}: {
  invoiceId?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.ReceivedPayableInvoices");
  const { basePath } = useBasePath();

  const clients = useAppStore((s) => s.clients);

  const addInvoice = useReceivedInvoiceStore((s) => s.addInvoice);
  const updateInvoice = useReceivedInvoiceStore((s) => s.updateInvoice);
  const invoiceToEdit = useReceivedInvoiceStore((s) =>
    invoiceId ? s.getInvoiceById(invoiceId) : undefined,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoiceDate:
        invoiceToEdit?.invoiceDate ?? new Date().toISOString().split("T")[0]!,
      dueDate: invoiceToEdit?.dueDate ?? "",
      clientId: invoiceToEdit?.clientId ?? "",
      amount: invoiceToEdit?.amount ?? 0,
      notes: invoiceToEdit?.notes ?? "",
      paymentMethod: invoiceToEdit?.paymentMethod ?? "",
    },
  });

  React.useEffect(() => {
    if (!invoiceToEdit) return;
    form.reset({
      invoiceDate: invoiceToEdit.invoiceDate,
      dueDate: invoiceToEdit.dueDate ?? "",
      clientId: invoiceToEdit.clientId,
      amount: invoiceToEdit.amount,
      notes: invoiceToEdit.notes ?? "",
      paymentMethod: invoiceToEdit.paymentMethod ?? "",
    });
  }, [form, invoiceToEdit]);

  const onSubmit = form.handleSubmit((data) => {
    const client = clients.find((c) => c.id === data.clientId);
    const merchantId = client?.merchantId ?? invoiceToEdit?.merchantId ?? "";

    if (invoiceId) {
      updateInvoice(invoiceId, {
        invoiceNumber: invoiceToEdit?.invoiceNumber ?? generateId("inv"),
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate || undefined,
        clientId: data.clientId,
        merchantId,
        amount: data.amount,
        notes: data.notes || undefined,
        direction: data.direction,
        paymentMethod: data.paymentMethod || undefined,
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      addInvoice({
        invoiceNumber: generateId("inv"),
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate || undefined,
        clientId: data.clientId,
        merchantId,
        amount: data.amount,
        currency: invoiceToEdit?.currency ?? "USD",
        notes: data.notes || undefined,
        items: invoiceToEdit?.items ?? [],
        direction: data.direction,
        paymentMethod: data.paymentMethod || undefined,
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
          <form className="space-y-4" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.client")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={t("form.client")} />
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

            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.invoiceDate")}</FormLabel>
                  <FormControl>
                    <DatePicker
                      id="invoiceDate"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        const value = date
                          ? date.toISOString().split("T")[0]!
                          : "";
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.paymentDueDate")}</FormLabel>
                  <FormControl>
                    <DatePicker
                      id="dueDate"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        const value = date
                          ? date.toISOString().split("T")[0]!
                          : "";
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.amount")}</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      value={String(field.value ?? 0)}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value || 0))
                      }
                      inputMode="decimal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.direction")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder={t("form.direction")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="receivable">Receivable</SelectItem>
                        <SelectItem value="payable">Payable</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.paymentMethod")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder={t("form.paymentMethod")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bank transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit card">Credit Card</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </form>
        </Form>
      </div>
    </div>
  );
}
