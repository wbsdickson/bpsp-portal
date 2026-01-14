"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useInvoiceStore } from "@/store/invoice-store";
import { useBasePath } from "@/hooks/use-base-path";
import { Pen, Check, X, Minus, Plus } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { InlineEditField } from "@/components/inline-edit-field";
import { createMerchantInvoiceSchema } from "../_lib/merchant-invoice-schema";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getInvoiceStatusBadgeVariant, InvoiceStatus } from "../_hooks/status";

export default function InvoiceDetail({ id }: { id: string }) {
  const t = useTranslations("Operator.Invoice");
  const { basePath } = useBasePath();
  const router = useRouter();

  const invoice = useInvoiceStore((s) =>
    id ? s.getInvoiceById(id) : undefined,
  );
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
  const clients = useAppStore((s) => s.clients);
  const merchants = useAppStore((s) => s.merchants);
  const taxes = useAppStore((s) => s.taxes);
  const getMerchantItems = useAppStore((s) => s.getMerchantItems);

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createMerchantInvoiceSchema(t), [t]);
  type InvoiceDetailValues = z.infer<typeof schema>;

  const form = useForm<InvoiceDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: invoice?.merchantId ?? "",
      clientId: invoice?.clientId ?? "",
      invoiceDate: invoice?.invoiceDate ?? "",
      dueDate: invoice?.dueDate ?? "",
      amount: invoice?.amount ?? 0,
      currency: invoice?.currency ?? "USD",
      updatedAt: invoice?.updatedAt,
      invoiceNumber: invoice?.invoiceNumber ?? "",
      status: (invoice?.status ?? "draft") as any,
      items:
        invoice?.items.map((i) => ({
          itemId: i.itemId,
          description: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          taxId: i.taxId,
        })) ?? [],
      remark: invoice?.notes ?? "",
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

  const availableItems = React.useMemo(
    () => getMerchantItems(selectedMerchantId),
    [getMerchantItems, selectedMerchantId],
  );

  useEffect(() => {
    if (invoice) {
      form.reset({
        merchantId: invoice.merchantId,
        clientId: invoice.clientId,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate ?? "",
        amount: invoice.amount,
        currency: invoice.currency,
        updatedAt: invoice.updatedAt,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status as any,
        items: invoice.items.map((i) => ({
          itemId: i.itemId,
          description: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          taxId: i.taxId,
        })),
        remark: invoice.notes ?? "",
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

  const client = clients.find((c) => c.id === invoice.clientId);
  const merchant = merchants.find((m) => m.id === invoice.merchantId);

  const onSubmit = form.handleSubmit((data) => {
    updateInvoice(id, {
      ...data,
      items: data.items.map((i: any) => ({
        ...i,
        id: generateId("item"),

        name: i.description || "",
        amount: i.quantity * i.unitPrice,
      })) as any,
      notes: data.remark,
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
            {invoice.invoiceNumber}
          </h2>
          <Badge
            variant={getInvoiceStatusBadgeVariant(
              (invoice.status as InvoiceStatus) || "draft",
            )}
          >
            {t(`statuses.${invoice.status}`)}
          </Badge>
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
                // setIsEditing(true);
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
                name="invoiceNumber"
                label={t("invoiceNumber")}
                isEditing={isEditing}
                value={invoice.invoiceNumber}
                renderInput={(field) => <Input {...field} className="h-9" />}
              />

              <InlineEditField
                control={form.control}
                name="status"
                label={t("status")}
                isEditing={isEditing}
                value={
                  <Badge
                    variant={getInvoiceStatusBadgeVariant(
                      (invoice.status as InvoiceStatus) || "draft",
                    )}
                  >
                    {t(`statuses.${invoice.status}`)}
                  </Badge>
                }
                renderInput={(field) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
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
                )}
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

              <InlineEditField
                control={form.control}
                name="clientId"
                label={t("client")}
                isEditing={isEditing}
                value={client?.name ?? invoice.recipientName ?? "—"}
                renderInput={(field) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {clients
                        .filter(
                          (c) => c.merchantId === form.watch("merchantId"),
                        )
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <InlineEditField
                control={form.control}
                name="invoiceDate"
                label={t("issueDate")}
                isEditing={isEditing}
                value={invoice.invoiceDate}
                renderInput={(field) => (
                  <Input type="date" {...field} className="h-9" />
                )}
              />

              <InlineEditField
                control={form.control}
                name="amount"
                label={t("amount")}
                isEditing={false} // Amount is calculated from items, keep read-only here
                value={`${getCurrencySymbol(invoice.currency)} ${formattedAmount(invoice.amount, invoice.currency)}`}
                renderInput={(field) => (
                  <Input {...field} className="h-9" disabled />
                )}
              />
            </div>
          </div>
          <div className="mt-6">
            <div>
              <div className="text-sm font-semibold">{t("upsert.items")}</div>
            </div>
            <div className="py-4">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t(
                          isEditing
                            ? "upsert.table.item"
                            : "preview.table.description",
                        )}
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        {t(
                          isEditing ? "upsert.table.qty" : "preview.table.qty",
                        )}
                      </TableHead>
                      <TableHead className="w-[160px] text-right">
                        {t(
                          isEditing
                            ? "upsert.table.unitPrice"
                            : "preview.table.unitPrice",
                        )}
                      </TableHead>
                      <TableHead className="w-[160px] text-right">
                        {t(
                          isEditing
                            ? "upsert.table.taxCategory"
                            : "preview.table.taxCategory",
                        )}
                      </TableHead>
                      <TableHead className="w-[160px] text-right">
                        {t(
                          isEditing
                            ? "upsert.table.amount"
                            : "preview.table.amount",
                        )}
                      </TableHead>
                      {isEditing && (
                        <TableHead className="w-[44px]"></TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isEditing
                      ? itemFields.map((row, index) => (
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
                                        (form.getValues(
                                          `items.${index}.quantity`,
                                        ) ?? 1) - 1,
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
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    form.setValue(
                                      `items.${index}.quantity`,
                                      (form.getValues(
                                        `items.${index}.quantity`,
                                      ) ?? 1) + 1,
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
                                          field.onChange(
                                            Number(e.target.value || 0),
                                          )
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
                                          <SelectItem
                                            key={tax.id}
                                            value={tax.id}
                                          >
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
                              {`${getCurrencySymbol(invoice.currency)} ${formattedAmount(
                                (form.getValues(`items.${index}.quantity`) ??
                                  0) *
                                  (form.getValues(`items.${index}.unitPrice`) ??
                                    0 *
                                      Number(
                                        taxById.get(
                                          form.getValues(
                                            `items.${index}.taxId`,
                                          ) ?? "",
                                        ) ?? 0,
                                      )),
                                invoice.currency,
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
                        ))
                      : (invoice.items ?? []).map((it) => (
                          <TableRow key={it.id}>
                            <TableCell className="text-sm">
                              {it.name || "—"}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {it.quantity}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {`${getCurrencySymbol(invoice.currency)} ${formattedAmount(it.unitPrice, invoice.currency)}`}
                            </TableCell>
                            <TableCell className="text-right text-sm font-medium">
                              {taxById.get(it.taxId) ?? "—"}
                            </TableCell>
                            <TableCell className="text-right text-sm font-medium">
                              {`${getCurrencySymbol(invoice.currency)} ${formattedAmount(it.amount, invoice.currency)}`}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>

              {isEditing && (
                <div className="mt-2">
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
                    <Plus />
                    {t("upsert.addItem")}
                  </Button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-end">
                <div className="text-sm font-medium">
                  {t("preview.total")}:{" "}
                  {`${getCurrencySymbol(invoice.currency)} ${formattedAmount(invoice.amount, invoice.currency)}`}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
