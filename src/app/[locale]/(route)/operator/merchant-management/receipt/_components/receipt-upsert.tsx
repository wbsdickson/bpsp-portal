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
import { DatePicker } from "@/components/ui/date-picker";
import { Minus, Plus, X } from "lucide-react";

import { useAppStore } from "@/lib/store";
import type { Item, ReceiptItem, Tax } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useReceiptStore } from "@/store/receipt-store";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";

const lineItemSchema = z.object({
  id: z.string().min(1),
  itemId: z.string().optional(),
  name: z.string().min(1),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  taxId: z.string().min(1),
});

const receiptUpsertSchema = z.object({
  merchantId: z.string().min(1),
  receiptNumber: z.string().min(1),
  clientId: z.string().min(1),
  issueDate: z.string().min(1),
  currency: z.string().min(1),
  notes: z.string().optional(),
  uploadedPdfName: z.string().optional(),
  items: z.array(lineItemSchema).min(1),
});

type ReceiptUpsertValues = z.infer<typeof receiptUpsertSchema>;

export function ReceiptUpsertPage({ receiptId }: { receiptId?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Receipt");
  const { basePath } = useBasePath();

  const clients = useAppStore((s) => s.clients);
  const taxes = useAppStore((s) => s.taxes);
  const items = useAppStore((s) => s.items);

  const addReceipt = useReceiptStore((s) => s.addReceipt);
  const updateReceipt = useReceiptStore((s) => s.updateReceipt);
  const receiptToEdit = useReceiptStore((s) =>
    receiptId ? s.getReceiptById(receiptId) : undefined,
  );

  const taxRateById = React.useMemo(() => {
    const map = new Map<string, number>();
    (taxes ?? []).forEach((t) => map.set(t.id, t.rate ?? 0));
    return map;
  }, [taxes]);

  const form = useForm<ReceiptUpsertValues>({
    resolver: zodResolver(receiptUpsertSchema),
    defaultValues: {
      merchantId: receiptToEdit?.merchantId ?? clients[0]?.merchantId ?? "u1",
      receiptNumber: receiptToEdit?.receiptNumber ?? generateId("rc"),
      clientId: receiptToEdit?.clientId ?? "",
      issueDate:
        receiptToEdit?.issueDate ?? new Date().toISOString().split("T")[0]!,
      currency: receiptToEdit?.currency ?? "USD",
      notes: receiptToEdit?.notes ?? "",
      uploadedPdfName: receiptToEdit?.uploadedPdfName ?? "",
      items: receiptToEdit?.items.map((it) => ({
        id: it.id,
        itemId: it.itemId,
        name: it.name,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxId: it.taxId,
      })) ?? [
        {
          id: generateId("rc_item"),
          itemId: "",
          name: "",
          quantity: 1,
          unitPrice: 0,
          taxId: taxes[0]?.id ?? "tax_10",
        },
      ],
    },
  });

  React.useEffect(() => {
    if (!receiptToEdit) return;

    form.reset({
      merchantId: receiptToEdit.merchantId,
      receiptNumber: receiptToEdit.receiptNumber,
      clientId: receiptToEdit.clientId,
      issueDate: receiptToEdit.issueDate,
      currency: receiptToEdit.currency,
      notes: receiptToEdit.notes ?? "",
      uploadedPdfName: receiptToEdit.uploadedPdfName ?? "",
      items: receiptToEdit.items.map((it) => ({
        id: it.id,
        itemId: it.itemId,
        name: it.name,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxId: it.taxId,
      })),
    });
  }, [form, receiptToEdit]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = useWatch({ control: form.control, name: "items" });

  const total = React.useMemo(() => {
    return (watchedItems ?? []).reduce((sum, it) => {
      const base = (it.quantity ?? 0) * (it.unitPrice ?? 0);
      const rate = taxRateById.get(it.taxId ?? "") ?? 0;
      const taxAmount = Math.round(base * rate);
      return sum + base + taxAmount;
    }, 0);
  }, [taxRateById, watchedItems]);

  const onSubmit = form.handleSubmit((data) => {
    const defaultTaxId = taxes[0]?.id ?? "tax_10";

    const storeItems: ReceiptItem[] = (data.items ?? []).map((it, idx) => {
      const quantity = it.quantity ?? 0;
      const unitPrice = it.unitPrice ?? 0;
      const base = quantity * unitPrice;
      const taxId = it.taxId || defaultTaxId;
      const rate = taxRateById.get(taxId) ?? 0;
      const taxAmount = Math.round(base * rate);

      return {
        id: it.id || `rci_${idx + 1}`,
        receiptId: receiptId ?? "",
        itemId: it.itemId || undefined,
        name: it.name,
        quantity,
        unitPrice,
        taxId,
        amount: base + taxAmount,
      };
    });

    if (receiptId) {
      updateReceipt(receiptId, {
        merchantId: data.merchantId,
        clientId: data.clientId,
        receiptNumber: data.receiptNumber,
        issueDate: data.issueDate,
        currency: data.currency,
        notes: data.notes || undefined,
        uploadedPdfName: data.uploadedPdfName || undefined,
        items: storeItems,
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      addReceipt({
        merchantId: data.merchantId,
        clientId: data.clientId,
        receiptNumber: data.receiptNumber,
        issueDate: data.issueDate,
        currency: data.currency,
        notes: data.notes || undefined,
        uploadedPdfName: data.uploadedPdfName || undefined,
        items: storeItems,
      });
      toast.success(t("messages.createSuccess"));
    }

    router.push(basePath);
  });

  const onSelectItem = (index: number, itemId: string) => {
    const selected = (items ?? []).find((i) => i.id === itemId);
    if (!selected) return;

    form.setValue(`items.${index}.itemId`, itemId, { shouldDirty: true });
    form.setValue(`items.${index}.name`, selected.name, { shouldDirty: true });
    form.setValue(`items.${index}.taxId`, selected.taxId, {
      shouldDirty: true,
    });
    form.setValue(`items.${index}.unitPrice`, selected.unitPrice ?? 0, {
      shouldDirty: true,
    });
  };

  return (
    <div className="bg-background min-h-[calc(100vh-0px)]">
      <div className="bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href={basePath}>
              <X className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex-1">
            <div className="text-sm font-medium">
              {receiptId ? t("form.editTitle") : t("form.createTitle")}
            </div>
          </div>

          <Button
            size="sm"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={onSubmit}
          >
            {receiptId ? t("buttons.saveChanges") : t("buttons.create")}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        {(clients ?? []).map((c) => (
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
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.issueDate")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        id="issueDate"
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
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("form.notes")}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uploadedPdfName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("form.pdf")}</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="application/pdf"
                        className="h-9"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file?.name ?? "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-background rounded-xl border">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-sm font-semibold">{t("form.items")}</div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9"
                  onClick={() =>
                    append({
                      id: generateId("rc_item"),
                      itemId: "",
                      name: "",
                      quantity: 1,
                      unitPrice: 0,
                      taxId: taxes[0]?.id ?? "tax_10",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> {t("buttons.addItem")}
                </Button>
              </div>
              <Separator />
              <div className="p-4">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("form.item")}</TableHead>
                        <TableHead className="w-[120px] text-right">
                          {t("form.quantity")}
                        </TableHead>
                        <TableHead className="w-[180px] text-right">
                          {t("form.unitPrice")}
                        </TableHead>
                        <TableHead className="w-[200px] text-right">
                          {t("form.taxCategory")}
                        </TableHead>
                        <TableHead className="w-[44px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name={`items.${index}.itemId`}
                                render={({ field }) => (
                                  <FormItem>
                                    <Select
                                      value={field.value ?? ""}
                                      onValueChange={(v) => {
                                        field.onChange(v);
                                        onSelectItem(index, v);
                                      }}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-9">
                                          <SelectValue
                                            placeholder={t("form.item")}
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {(items ?? []).map((it: Item) => (
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
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="inline-flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  const cur =
                                    form.getValues(`items.${index}.quantity`) ??
                                    1;
                                  form.setValue(
                                    `items.${index}.quantity`,
                                    Math.max(1, cur - 1),
                                    {
                                      shouldDirty: true,
                                    },
                                  );
                                }}
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
                                        className="h-8 w-[64px] text-right"
                                        value={String(field.value ?? 1)}
                                        onChange={(e) =>
                                          field.onChange(
                                            Math.max(
                                              1,
                                              Number(e.target.value || 1),
                                            ),
                                          )
                                        }
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
                                onClick={() => {
                                  const cur =
                                    form.getValues(`items.${index}.quantity`) ??
                                    1;
                                  form.setValue(
                                    `items.${index}.quantity`,
                                    cur + 1,
                                    { shouldDirty: true },
                                  );
                                }}
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
                                      className="h-9 text-right"
                                      value={String(field.value ?? 0)}
                                      onChange={(e) =>
                                        field.onChange(
                                          Number(e.target.value || 0),
                                        )
                                      }
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
                                        <SelectValue
                                          placeholder={t("form.taxCategory")}
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {(taxes ?? []).map((tx: Tax) => (
                                        <SelectItem key={tx.id} value={tx.id}>
                                          {tx.name}
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
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-2">
                      {t("form.total")}
                    </span>
                    <span className="font-semibold">{total}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
