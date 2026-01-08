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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { useInvoiceStore } from "@/store/merchant/invoice-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";
import { createMerchantInvoiceSchema } from "../_lib/merchant-invoice-schema";
import { Minus, Plus, X } from "lucide-react";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";

interface InvoiceUpsertFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  invoiceId?: string; // Optional, though usually for create
}

export function InvoiceUpsertForm({
  onCancel,
  onSuccess,
  invoiceId,
}: InvoiceUpsertFormProps) {
  const t = useTranslations("Merchant.InvoiceManagement");

  const merchants = useAppStore((s) => s.merchants);
  const customers = useAppStore((s) => s.clients);
  const taxes = useAppStore((s) => s.taxes);
  const getMerchantItems = useAppStore((s) => s.getMerchantItems);

  const addInvoice = useInvoiceStore((s) => s.addInvoice);
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
  const invoiceToEdit = useInvoiceStore((s) =>
    invoiceId ? s.getInvoiceById(invoiceId) : undefined,
  );

  const schema = React.useMemo(() => createMerchantInvoiceSchema(t), [t]);
  type InvoiceUpsertValues = z.infer<typeof schema>;

  const form = useForm<InvoiceUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: invoiceToEdit?.merchantId ?? merchants[0]?.id ?? "",
      clientId: invoiceToEdit?.clientId ?? "",
      invoiceDate:
        invoiceToEdit?.invoiceDate ?? new Date().toISOString().split("T")[0],
      dueDate: invoiceToEdit?.dueDate ?? "",
      invoiceNumber: invoiceToEdit?.invoiceNumber ?? generateId("inv"),
      amount: invoiceToEdit?.amount ?? 0,
      currency: invoiceToEdit?.currency ?? "USD",
      status: (invoiceToEdit?.status ?? "draft") as any,
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
          taxId: taxes[0]?.id ?? "",
        },
      ],
    },
  });

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
    } else if (!selectedCustomerId) {
      form.setValue("clientId", availableCustomers[0]!.id);
    }
  }, [availableCustomers, selectedCustomerId, form]);

  const subtotal = React.useMemo(() => {
    return items.reduce((acc, item) => {
      const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);
      const taxRate = taxRateById.get(item.taxId ?? "") ?? 0;
      return acc + lineTotal + (lineTotal * taxRate) / 100;
    }, 0);
  }, [items, taxRateById]);

  // Update amount in form when items change, or just calculate on submit.
  // We should update it so validation passes/matches.
  React.useEffect(() => {
    form.setValue("amount", subtotal);
  }, [subtotal, form]);

  const onSubmit = (data: InvoiceUpsertValues) => {
    try {
      const itemsWithAmount = data.items.map((it) => {
        const lineTotal = it.quantity * it.unitPrice;
        const taxRate = taxRateById.get(it.taxId ?? "") ?? 0;
        return {
          ...it,
          id: generateId("item"), // Since schema creates new objects
          name: it.description || "",
          amount: lineTotal + (lineTotal * taxRate) / 100,
        };
      });

      const payload = {
        ...data,
        items: itemsWithAmount,
      };

      if (invoiceToEdit) {
        updateInvoice(invoiceToEdit.id, payload as any);
        toast.success(t("messages.updateSuccess"));
      } else {
        addInvoice({
          ...payload,
          id: generateId("inv"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as any);
        toast.success(t("messages.createSuccess"));
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(t("messages.error"));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="merchantId"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-sm font-medium">
                  {t("upsert.merchant")}
                </div>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-9 w-full">
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

          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-sm font-medium">
                  {t("upsert.client")}
                </div>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-9 w-full">
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

          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-sm font-medium">
                  {t("invoiceNumber")}
                </div>
                <FormControl>
                  <Input {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-sm font-medium">{t("status")}</div>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={t("status")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      "draft",
                      "pending",
                      "approved",
                      "paid",
                      "rejected",
                      "void",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
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
                <div className="mb-1 text-sm font-medium">{t("issueDate")}</div>
                <FormControl>
                  <Input type="date" {...field} className="h-9" />
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
                <div className="mb-1 text-sm font-medium">{t("dueDate")}</div>
                <FormControl>
                  <Input type="date" {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-sm font-medium">
                  {t("upsert.selectCurrency")}
                </div>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold">{t("upsert.items")}</div>
          <div className="rounded-lg border">
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
                                      Math.max(1, Number(e.target.value || 1)),
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
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            form.setValue(
                              `items.${index}.quantity`,
                              (form.getValues(`items.${index}.quantity`) ?? 1) +
                                1,
                            )
                          }
                        >
                          <Plus />
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
                    <TableCell className="text-right">
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
                      {`${getCurrencySymbol(currency)} ${formattedAmount(
                        (form.getValues(`items.${index}.quantity`) ?? 0) *
                          (form.getValues(`items.${index}.unitPrice`) ?? 0) *
                          (1 +
                            parseFloat(
                              taxRateById
                                .get(
                                  form.getValues(`items.${index}.taxId`) ?? "",
                                )
                                ?.toString() || "0",
                            ) /
                              100),
                        currency,
                      )}`}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => remove(index)}
                        disabled={itemFields.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() =>
                append({
                  itemId: "",
                  description: "",
                  quantity: 1,
                  unitPrice: 0,
                  taxId: taxes[0]?.id ?? "",
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("upsert.addItem")}
            </Button>
            <div className="text-sm font-semibold">
              {t("preview.total")}:{" "}
              {`${getCurrencySymbol(currency)} ${formattedAmount(subtotal, currency)}`}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="submit">{t("save")}</Button>
        </div>
      </form>
    </Form>
  );
}
