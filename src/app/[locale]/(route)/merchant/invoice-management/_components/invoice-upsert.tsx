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
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Minus, Plus, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Client, Item, Merchant, Tax } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useInvoiceStore } from "@/store/merchant/invoice-store";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { absoluteUrl, generateId } from "@/lib/utils";
import { useBasePath } from "@/hooks/use-base-path";
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
  items: z.array(lineItemFormSchema).min(1),
  remark: z.string().optional(),
});

type InvoiceUpsertFormValues = z.infer<typeof invoiceUpsertFormSchema>;

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

type CreateInvoiceFormProps = {
  form: UseFormReturn<InvoiceUpsertFormValues>;
  merchants: Merchant[];
  availableCustomers: Client[];
  availableItems: Item[];
  taxes: Tax[];
  subtotal: number;
  itemFields: FieldArrayWithId<InvoiceUpsertFormValues, "items", "id">[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
};

function CreateInvoiceForm({
  form,
  merchants,
  availableCustomers,
  availableItems,
  taxes,
  subtotal,
  itemFields,
  onAddItem,
  onRemoveItem,
}: CreateInvoiceFormProps) {
  const t = useTranslations("Merchant.InvoiceManagement");

  const currency = useWatch({ control: form.control, name: "currency" });
  const taxRateById = React.useMemo(() => {
    const map = new Map<string, number>();
    taxes.forEach((t) => map.set(t.id, t.rate ?? 0));
    return map;
  }, [taxes]);

  return (
    <ScrollArea className="h-[calc(100vh-120px)] pr-2">
      <div className="space-y-8">
        <section className="space-y-3">
          <div className="text-sm font-semibold">{t("upsert.merchant")}</div>

          <div className="max-w-sm">
            <FormField
              control={form.control}
              name="merchantId"
              render={({ field }) => (
                <FormItem>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("upsert.selectMerchant")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {merchants.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
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

        <section className="space-y-3">
          <div className="text-sm font-semibold">{t("upsert.client")}</div>
          <div className="max-w-sm">
            <FormField
              control={form.control}
              name="clientId"
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

        <section className="space-y-3">
          <div className="text-sm font-semibold">{t("upsert.invoiceDate")}</div>
          <div className="max-w-sm">
            <FormField
              control={form.control}
              name="invoiceDate"
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
          <div className="text-sm font-semibold">Due Date</div>
          <div className="max-w-sm">
            <FormField
              control={form.control}
              name="dueDate"
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
          <div className="text-sm font-semibold">{t("upsert.items")}</div>

          <div className="flex flex-col gap-3">
            <div className="bg-background rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("upsert.table.item")}</TableHead>
                    <TableHead className="w-[120px] text-right">
                      {t("upsert.table.qty")}
                    </TableHead>
                    <TableHead className="w-[160px] text-right">
                      {t("upsert.table.unitPrice")}
                    </TableHead>
                    <TableHead className="w-[160px] text-right">
                      {t("upsert.table.taxCategory")}
                    </TableHead>
                    <TableHead className="w-[160px] text-right">
                      {t("upsert.table.amount")}
                    </TableHead>
                    <TableHead className="w-[44px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemFields.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.itemId`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                value={field.value ?? ""}
                                onValueChange={(v) => {
                                  field.onChange(v);
                                  const selected = availableItems.find(
                                    (it) => it.id === v,
                                  );
                                  if (!selected) return;

                                  form.setValue(
                                    `items.${index}.description`,
                                    selected.name,
                                    { shouldDirty: true },
                                  );
                                  form.setValue(
                                    `items.${index}.taxId`,
                                    selected.taxId,
                                    { shouldDirty: true },
                                  );
                                  form.setValue(
                                    `items.${index}.unitPrice`,
                                    selected.unitPrice ?? 0,
                                    { shouldDirty: true },
                                  );
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select item" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableItems.map((it) => (
                                    <SelectItem key={it.id} value={it.id}>
                                      {it.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              form.setValue(
                                `items.${index}.quantity`,
                                Math.max(
                                  1,
                                  (form.getValues(`items.${index}.quantity`) ??
                                    1) - 1,
                                ),
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    value={String(field.value ?? 1)}
                                    onChange={(e) =>
                                      field.onChange(
                                        Math.max(
                                          1,
                                          Number(e.target.value || 1),
                                        ),
                                      )
                                    }
                                    className="h-8 w-[64px] text-right"
                                    inputMode="numeric"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              form.setValue(
                                `items.${index}.quantity`,
                                (form.getValues(`items.${index}.quantity`) ??
                                  1) + 1,
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <FormField
                          control={form.control}
                          name={`items.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  value={String(field.value ?? 0)}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value || 0))
                                  }
                                  className="h-9 text-right"
                                  inputMode="decimal"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <FormField
                          control={form.control}
                          name={`items.${index}.taxId`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select tax" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {taxes.map((tax) => (
                                    <SelectItem key={tax.id} value={tax.id}>
                                      {tax.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatMoney(
                          (form.getValues(`items.${index}.quantity`) ?? 0) *
                            (form.getValues(`items.${index}.unitPrice`) ?? 0) *
                            (taxRateById.get(
                              form.getValues(`items.${index}.taxId`) ?? "",
                            ) ?? 0),
                          currency,
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onRemoveItem(index)}
                          disabled={itemFields.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator />
              <div className="flex items-center justify-between gap-4 p-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={onAddItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("upsert.addItem")}
                </Button>
                <div className="text-sm">
                  <span className="text-muted-foreground mr-2">
                    {t("upsert.subtotal")}
                  </span>
                  <span className="font-semibold">
                    {formatMoney(subtotal, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-8" />
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
  const t = useTranslations("Operator.Invoice");
  const { basePath } = useBasePath();

  const merchants = useAppStore((s) => s.merchants);
  const customers = useAppStore((s) => s.clients);
  const taxes = useAppStore((s) => s.taxes);
  const getMerchantItems = useAppStore((s) => s.getMerchantItems);

  const addInvoice = useInvoiceStore((s) => s.addInvoice);
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
  const invoiceToEdit = useInvoiceStore((s) =>
    invoiceId ? s.getInvoiceById(invoiceId) : undefined,
  );

  const form = useForm<InvoiceUpsertFormValues>({
    resolver: zodResolver(invoiceUpsertFormSchema),
    defaultValues: {
      merchantId: invoiceToEdit?.merchantId ?? merchants[0]?.id ?? "",
      clientId: invoiceToEdit?.clientId ?? "",
      invoiceDate:
        invoiceToEdit?.invoiceDate ?? new Date().toISOString().split("T")[0]!,
      dueDate: invoiceToEdit?.dueDate ?? "",
      invoiceNumber: invoiceToEdit?.invoiceNumber ?? generateId("inv"),
      amount: invoiceToEdit?.amount ?? 0,
      currency: invoiceToEdit?.currency ?? "USD",
      updatedAt: invoiceToEdit?.updatedAt,
      items: invoiceToEdit?.items.map((it) => ({
        itemId: it.itemId,
        description: it.name,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxId: it.taxId,
      })) ?? [
        {
          itemId: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
          taxId: taxes[0]?.id ?? "tax_default",
        },
      ],
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
      clientId: invoiceToEdit.clientId,
      invoiceDate: invoiceToEdit.invoiceDate,
      dueDate: invoiceToEdit.dueDate ?? "",
      amount: invoiceToEdit.amount,
      currency: invoiceToEdit.currency,
      updatedAt: invoiceToEdit.updatedAt,
      invoiceNumber: invoiceToEdit.invoiceNumber,
      items: invoiceToEdit.items.map((it) => ({
        itemId: it.itemId,
        description: it.name,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxId: it.taxId,
        remark: "",
      })),
    });
  }, [form, invoiceToEdit, merchants]);

  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const selectedMerchantId = useWatch({
    control: form.control,
    name: "merchantId",
  });
  const selectedCustomerId = useWatch({
    control: form.control,
    name: "clientId",
  });
  const currency = useWatch({ control: form.control, name: "currency" });
  const items = useWatch({ control: form.control, name: "items" });

  const taxRateById = React.useMemo(() => {
    const map = new Map<string, number>();
    taxes.forEach((t) => map.set(t.id, t.rate ?? 0));
    return map;
  }, [taxes]);

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

  const customer = React.useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  );

  const subtotal = React.useMemo(
    () =>
      (items ?? []).reduce((sum, it) => {
        const base = (it.quantity ?? 0) * (it.unitPrice ?? 0);
        const rate = taxRateById.get(it.taxId ?? "") ?? 0;
        const taxAmount = Math.round(base * rate);
        return sum + base + taxAmount;
      }, 0),
    [items, taxRateById],
  );

  React.useEffect(() => {
    form.setValue("amount", subtotal);
  }, [form, subtotal]);

  const onSubmit = form.handleSubmit((data: InvoiceUpsertFormValues) => {
    const now = new Date();
    const defaultTaxId = taxes[0]?.id ?? "tax_default";

    const storeItems = (data.items ?? []).map(
      (it: InvoiceUpsertFormValues["items"][number], idx: number) => {
        const quantity = it.quantity ?? 0;
        const unitPrice = it.unitPrice ?? 0;
        const base = quantity * unitPrice;
        const taxId = it.taxId || defaultTaxId;
        const rate = taxRateById.get(taxId) ?? 0;
        const taxAmount = Math.round(base * rate);

        return {
          id: `inv_item_${idx + 1}`,
          invoiceId: invoiceId ?? "",
          itemId: it.itemId || undefined,
          name: it.description || t("upsert.fallbackItem"),
          quantity,
          unitPrice,
          taxId,
          amount: base + taxAmount,
        };
      },
    );

    if (invoiceId) {
      updateInvoice(invoiceId, {
        merchantId: data.merchantId,
        clientId: data.clientId,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate || undefined,
        amount: subtotal,
        currency: data.currency,
        items: storeItems,
        updatedAt: now.toISOString(),
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      const path = absoluteUrl(`/invoice/${data.invoiceNumber}`);
      addInvoice({
        merchantId: data.merchantId,
        clientId: data.clientId,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate || undefined,
        direction: "receivable",
        amount: subtotal,
        currency: data.currency,
        items: storeItems,
        invoiceNumber: data.invoiceNumber,
        fileUrl: path,
      });
      toast.success(t("messages.createSuccess"));
    }

    router.push(basePath);
  });

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
        <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
          <CreateInvoiceForm
            form={form}
            merchants={merchants}
            availableCustomers={availableCustomers}
            availableItems={availableItems}
            taxes={taxes}
            subtotal={subtotal}
            itemFields={itemFields}
            onAddItem={() =>
              append({
                itemId: "",
                description: "",
                quantity: 1,
                unitPrice: 0,
                taxId: taxes[0]?.id ?? "tax_default",
              })
            }
            onRemoveItem={(index) => remove(index)}
          />
          <InvoicePreview
            customer={customer}
            currency={currency}
            subtotal={subtotal}
            invoiceNumber={form.getValues("invoiceNumber")}
            taxes={taxes}
            items={(items ?? []).map(
              (it: InvoiceUpsertFormValues["items"][number], idx: number) => ({
                id: `item_${idx + 1}`,
                description: it.description ?? "",
                quantity: it.quantity ?? 0,
                unitPrice: it.unitPrice ?? 0,
                taxId: it.taxId ?? "",
              }),
            )}
          />
        </div>
      </Form>
    </div>
  );
}
