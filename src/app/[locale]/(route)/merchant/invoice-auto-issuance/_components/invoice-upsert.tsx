"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Client, Item, Merchant, Tax } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useInvoiceAutoIssuanceStore } from "@/store/merchant/invoice-auto-issuance-store";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormReturn } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useBasePath } from "@/hooks/use-base-path";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type LineItem = {
  id: string;
  itemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxId?: string;
};

const lineItemFormSchema = z.object({
  itemId: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  taxId: z.string().optional(),
});

const invoiceUpsertFormSchema = z.object({
  merchantId: z.string().min(1),
  clientId: z.string().min(1),
  invoiceDate: z.string().min(1),
  dueDate: z.string().optional(),
  amount: z.number().min(0),
  currency: z.string().min(1),
  updatedAt: z.string().optional(),
  invoiceNumber: z.string().min(1),
  scheduleName: z.string().min(1),
  targetClient: z.string().min(1),
  issuanceFrequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  intervalValue: z.number().min(1),
  nextIssuanceDate: z.string().min(1),
  enabled: z.boolean().catch(false),
  createdAt: z.string().min(1),
  templateId: z.string().min(1),
});

type InvoiceAutoIssuanceUpsertFormValues = z.infer<
  typeof invoiceUpsertFormSchema
>;

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

type CreateInvoiceAutoIssuanceFormProps = {
  form: UseFormReturn<InvoiceAutoIssuanceUpsertFormValues>;
  merchants: Merchant[];
  availableCustomers: Client[];
  availableItems: Item[];
  taxes: Tax[];
  subtotal: number;
};

function CreateInvoiceAutoIssuanceForm({
  form,
  availableCustomers,
}: CreateInvoiceAutoIssuanceFormProps) {
  const t = useTranslations("Merchant.InvoiceAutoIssuance");

  return (
    <ScrollArea className="h-[calc(100vh-120px)] pr-2">
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <section className="space-y-3">
            <div className="text-sm font-semibold">{t("scheduleName")}</div>

            <div className="max-w-sm">
              <FormField
                control={form.control}
                name="scheduleName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9"
                        maxLength={40}
                        value={field.value as string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-sm font-semibold">{t("upsert.client")}</div>
            <div className="max-w-sm">
              <FormField
                control={form.control}
                name="targetClient"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("upsert.selectClient")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCustomers.map((c) => (
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
          </section>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <section className="space-y-3">
            <div className="text-sm font-semibold">{t("nextIssuanceDate")}</div>
            <div className="max-w-sm">
              <FormField
                control={form.control}
                name="nextIssuanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="date" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-sm font-semibold">{t("startDate")}</div>
            <div className="max-w-sm">
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-9"
                        value={field.value as string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <section className="space-y-3">
            <div className="text-sm font-semibold">{t("template")}</div>

            <div className="max-w-sm">
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9"
                        maxLength={40}
                        value={field.value as string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-sm font-semibold">Enabled</div>
            <div className="max-w-sm">
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
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
          </section>
        </div>
      </div>
    </ScrollArea>
  );
}

type InvoicePreviewProps = {
  customer: Client | null;
  currency: string;
  subtotal: number;
  invoiceNumber: string;
  items: LineItem[];
  taxes: Tax[];
};

function InvoicePreview({
  customer,
  currency,
  subtotal,
  invoiceNumber,
  items,
  taxes,
}: InvoicePreviewProps) {
  const t = useTranslations("Operator.Invoice");
  const taxById = React.useMemo(() => {
    const map = new Map<string, Tax>();
    taxes.forEach((t) => map.set(t.id, t));
    return map;
  }, [taxes]);

  return (
    <div className="bg-muted/40 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{t("preview.title")}</div>
        {/* <Button variant="ghost" size="icon" className="h-8 w-8">
          <ExternalLink className="h-4 w-4" />
        </Button> */}
      </div>

      <div className="bg-background mt-4 rounded-xl border p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{t("preview.invoice")}</div>
            <div className="text-muted-foreground mt-2 grid gap-1 text-xs">
              <div>
                <span className="text-foreground font-medium">
                  {t("preview.invoiceNumber")}
                </span>
                : {invoiceNumber}
              </div>
              <div>
                <span className="text-foreground font-medium">
                  {t("preview.dateOfIssue")}
                </span>
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* <div className="text-right">
            <div className="text-muted-foreground text-xs">
              acct_1SezNrLzWZr8P1xn
            </div>
            <div className="text-muted-foreground mt-2 text-xs">
              United States
            </div>
          </div> */}
        </div>

        <Separator className="my-4" />

        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("preview.billTo")}
            </div>
            <div className="text-sm font-medium">{customer?.name ?? "—"}</div>
            <div className="text-muted-foreground text-xs">
              {customer?.email ?? ""}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("preview.table.description")}</TableHead>
                <TableHead className="text-right">
                  {t("preview.table.qty")}
                </TableHead>
                <TableHead className="text-right">
                  {t("preview.table.unitPrice")}
                </TableHead>
                <TableHead className="text-right">
                  {t("preview.table.taxCategory")}
                </TableHead>
                <TableHead className="text-right">
                  {t("preview.table.amount")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="text-sm">
                    {it.description || "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {it.quantity}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {formatMoney(it.unitPrice, currency)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {taxById.get(it.taxId ?? "")?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatMoney(
                      it.quantity * it.unitPrice +
                        Math.round(
                          it.quantity *
                            it.unitPrice *
                            (taxById.get(it.taxId ?? "")?.rate ?? 0),
                        ),
                      currency,
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <div className="w-full max-w-[280px] space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">
                {t("preview.subtotal")}
              </div>
              <div className="font-medium">
                {formatMoney(subtotal, currency)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">{t("preview.total")}</div>
              <div className="font-semibold">
                {formatMoney(subtotal, currency)}
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">
                {t("preview.amountDue")}
              </div>
              <div className="font-semibold">
                {formatMoney(subtotal, currency)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InvoiceUpsertPage({ invoiceId }: { invoiceId?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.InvoiceAutoIssuance");
  const { basePath } = useBasePath();

  const merchants = useAppStore((s) => s.merchants);
  const customers = useAppStore((s) => s.clients);
  const taxes = useAppStore((s) => s.taxes);
  const getMerchantItems = useAppStore((s) => s.getMerchantItems);

  const addInvoice = useInvoiceAutoIssuanceStore((s) => s.addAutoIssuance);
  const updateInvoice = useInvoiceAutoIssuanceStore(
    (s) => s.updateAutoIssuance,
  );
  const invoiceToEdit = useInvoiceAutoIssuanceStore((s) =>
    invoiceId ? s.getAutoIssuanceById(invoiceId) : undefined,
  );

  const form = useForm<InvoiceAutoIssuanceUpsertFormValues>({
    resolver: zodResolver(invoiceUpsertFormSchema),
    defaultValues: {
      merchantId: invoiceToEdit?.merchantId ?? merchants[0]?.id ?? "",
      clientId: invoiceToEdit?.targetClient ?? "",
      targetClient: invoiceToEdit?.targetClient ?? "",
      issuanceFrequency:
        (invoiceToEdit?.issuanceFrequency as InvoiceAutoIssuanceUpsertFormValues["issuanceFrequency"]) ??
        "daily",
      intervalValue: invoiceToEdit?.intervalValue ?? 1,
      scheduleName: invoiceToEdit?.scheduleName ?? "",
      nextIssuanceDate: invoiceToEdit?.nextIssuanceDate
        ? invoiceToEdit.nextIssuanceDate.split("T")[0]!
        : new Date().toISOString().split("T")[0]!,
      enabled: invoiceToEdit?.enabled ?? false,
      createdAt: invoiceToEdit?.createdAt
        ? invoiceToEdit.createdAt.split("T")[0]!
        : new Date().toISOString().split("T")[0]!,
      invoiceDate: new Date().toISOString().split("T")[0]!,
      dueDate: "",
      amount: 0,
      currency: "USD",
      invoiceNumber: `AUTO-${Date.now()}`,
      templateId: "",
    },
  });

  React.useEffect(() => {
    if (!invoiceToEdit) {
      if (!form.getValues("merchantId") && merchants[0]?.id) {
        form.setValue("merchantId", merchants[0].id);
      }
      return;
    }

    form.reset({
      merchantId: invoiceToEdit.merchantId,
      clientId: invoiceToEdit.targetClient,
      targetClient: invoiceToEdit.targetClient,
      scheduleName: invoiceToEdit.scheduleName,
      issuanceFrequency:
        invoiceToEdit.issuanceFrequency as InvoiceAutoIssuanceUpsertFormValues["issuanceFrequency"],
      intervalValue: invoiceToEdit.intervalValue,
      nextIssuanceDate: invoiceToEdit.nextIssuanceDate
        ? invoiceToEdit.nextIssuanceDate.split("T")[0]!
        : new Date().toISOString().split("T")[0]!,
      enabled: invoiceToEdit.enabled,
      createdAt: invoiceToEdit.createdAt
        ? invoiceToEdit.createdAt.split("T")[0]!
        : new Date().toISOString().split("T")[0]!,
      invoiceDate: new Date().toISOString().split("T")[0]!,
      dueDate: "",
      amount: invoiceToEdit.intervalValue ?? 0,
      currency: "USD",
      invoiceNumber: `AUTO-${invoiceToEdit.id}`,
      templateId: "",
    });
  }, [form, invoiceToEdit, merchants]);

  const selectedMerchantId = useWatch({
    control: form.control,
    name: "merchantId",
  });
  const selectedCustomerId = useWatch({
    control: form.control,
    name: "targetClient",
  });
  const currency = useWatch({ control: form.control, name: "currency" });
  const scheduleName = useWatch({
    control: form.control,
    name: "scheduleName",
  });
  const targetClient = useWatch({
    control: form.control,
    name: "targetClient",
  });
  const issuanceFrequency = useWatch({
    control: form.control,
    name: "issuanceFrequency",
  });
  const intervalValue = useWatch({
    control: form.control,
    name: "intervalValue",
  });
  const nextIssuanceDate = useWatch({
    control: form.control,
    name: "nextIssuanceDate",
  });

  const availableCustomers = React.useMemo(
    () => customers.filter((c) => c.merchantId === selectedMerchantId),
    [customers, selectedMerchantId],
  );

  const availableItems = React.useMemo(
    () => getMerchantItems(selectedMerchantId),
    [getMerchantItems, selectedMerchantId],
  );

  React.useEffect(() => {
    if (availableCustomers.length === 0) {
      if (selectedCustomerId !== "") form.setValue("clientId", "");
      return;
    }

    const stillValid = availableCustomers.some(
      (c) => c.id === selectedCustomerId,
    );
    if (!stillValid) {
      form.setValue("clientId", availableCustomers[0]!.id);
    }
  }, [availableCustomers, form, selectedCustomerId]);

  const subtotal = React.useMemo(
    () => invoiceToEdit?.intervalValue ?? 0,
    [invoiceToEdit?.intervalValue],
  );

  React.useEffect(() => {
    form.setValue("amount", subtotal);
  }, [form, subtotal]);

  const onSubmit = form.handleSubmit(
    (data: InvoiceAutoIssuanceUpsertFormValues) => {
      if (invoiceId) {
        updateInvoice(invoiceId, {
          merchantId: data.merchantId,
          targetClient: data.targetClient,
          scheduleName: data.scheduleName,
          issuanceFrequency: data.issuanceFrequency,
          intervalValue: data.intervalValue,
          nextIssuanceDate: data.nextIssuanceDate,
          enabled: data.enabled,
        });
        toast.success(t("messages.updateSuccess"));
      } else {
        addInvoice({
          merchantId: data.merchantId,
          targetClient: data.targetClient,
          scheduleName: data.scheduleName,
          issuanceFrequency: data.issuanceFrequency,
          intervalValue: data.intervalValue,
          nextIssuanceDate: data.nextIssuanceDate,
          enabled: data.enabled,
          createdAt: new Date().toISOString(),
        });
        toast.success(t("messages.createSuccess"));
      }
      router.push(basePath);
    },
  );

  return (
    <div className="bg-background min-h-[calc(100vh-0px)] rounded-lg p-4 pr-2">
      <div className="bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href={basePath}>
              <X className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex-1">
            <div className="text-xl font-bold">
              {invoiceId ? t("upsert.editTitle") : t("upsert.createTitle")}
            </div>
          </div>

          <Button
            size="sm"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={onSubmit}
          >
            {invoiceId ? t("upsert.saveChanges") : t("upsert.createButton")}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <div className="space-y-6 px-6 py-6">
          <CreateInvoiceAutoIssuanceForm
            form={form}
            availableCustomers={availableCustomers}
            merchants={merchants}
            availableItems={availableItems}
            taxes={taxes}
            subtotal={subtotal}
          />
        </div>
      </Form>
    </div>
  );
}
