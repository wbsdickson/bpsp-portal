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
import { useBasePath } from "@/hooks/use-base-path";
import { X, Minus, Plus } from "lucide-react";
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
import { createMerchantPurchaseOrderSchema } from "../_lib/merchant-purchase-order-schema";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePurchaseOrderStore } from "@/store/merchant/purchase-order-store";
import { Badge } from "@/components/ui/badge";

export default function PurchaseOrderDetail({
  purchaseOrderId,
}: {
  purchaseOrderId: string;
}) {
  const t = useTranslations("Merchant.PurchaseOrders");

  const purchaseOrder = usePurchaseOrderStore((s) =>
    purchaseOrderId ? s.getPurchaseOrderById(purchaseOrderId) : undefined,
  );
  const updatePurchaseOrder = usePurchaseOrderStore(
    (s) => s.updatePurchaseOrder,
  );
  const clients = useAppStore((s) => s.clients);
  const merchants = useAppStore((s) => s.merchants);
  const taxes = useAppStore((s) => s.taxes);
  const getMerchantItems = useAppStore((s) => s.getMerchantItems);

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createMerchantPurchaseOrderSchema(t), [t]);
  type QuotationDetailValues = z.infer<typeof schema>;

  const form = useForm<QuotationDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: purchaseOrder?.clientId ?? "",
      purchaseOrderDate: purchaseOrder?.poDate ?? "",
      items:
        purchaseOrder?.items.map((i) => ({
          itemId: i.itemId,
          description: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          taxId: i.taxId,
        })) ?? [],
      notes: purchaseOrder?.notes ?? "",
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

  const merchantId = (purchaseOrder as any)?.merchantId ?? "u1";

  const selectedMerchantId = merchantId;

  const availableItems = React.useMemo(
    () => getMerchantItems(selectedMerchantId),
    [getMerchantItems, selectedMerchantId],
  );

  useEffect(() => {
    if (purchaseOrder) {
      form.reset({
        clientId: purchaseOrder.clientId,
        purchaseOrderDate: purchaseOrder.poDate,
        items: purchaseOrder.items.map((i) => ({
          itemId: i.itemId,
          description: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          taxId: i.taxId,
        })),
        notes: purchaseOrder.notes ?? "",
      });
    }
  }, [purchaseOrder, form]);

  const taxById = React.useMemo(() => {
    const map = new Map<string, string>();
    const rateMap = new Map<string, number>();
    (taxes ?? []).forEach((tx) => {
      map.set(tx.id, tx.name);
      rateMap.set(tx.id, tx.rate ?? 0);
    });
    return { map, rateMap };
  }, [taxes]);

  if (!purchaseOrder) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        {t("messages.notFound")}
      </div>
    );
  }

  const client = clients.find((c) => c.id === purchaseOrder.clientId);
  const merchant = merchants.find((m) => m.id === merchantId);

  const onSubmit = form.handleSubmit((data) => {
    updatePurchaseOrder(purchaseOrder.id, {
      ...data,
      items: data.items.map((i: any) => ({
        ...i,
        id: generateId("qti"),
        name: i.description || "",
        amount: i.quantity * i.unitPrice,
      })) as any,
      notes: data.notes,
    });
    setIsEditing(false);
    toast.success(t("messages.updateSuccess"));
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const currency = (purchaseOrder as any).currency ?? "USD"; // Default to USD if missing

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            <div className="flex items-center gap-3">
              {purchaseOrder.status === "draft" && (
                <Badge variant="info" className="capitalize">
                  {t("statuses.draft")}
                </Badge>
              )}
              {purchaseOrder.status === "sent" && (
                <Badge variant="warning" className="capitalize">
                  {t("statuses.sent")}
                </Badge>
              )}
              {purchaseOrder.status === "accepted" && (
                <Badge variant="warning" className="capitalize">
                  {t("statuses.accepted")}
                </Badge>
              )}
              {purchaseOrder.status === "rejected" && (
                <Badge variant="destructive" className="capitalize">
                  {t("statuses.rejected")}
                </Badge>
              )}
              {purchaseOrder.status === "expired" && (
                <Badge variant="warning" className="capitalize">
                  {t("statuses.expired")}
                </Badge>
              )}
            </div>
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="secondary" size="xs" onClick={onCancel}>
                Discard
              </Button>
              <Button variant="secondary" size="xs" onClick={onSubmit}>
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="bg-card rounded-md p-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InlineEditField
                control={form.control}
                name="clientId"
                label={t("columns.clientName")}
                isEditing={isEditing}
                value={client?.name ?? purchaseOrder.clientId ?? "—"}
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
                        .filter((c) => c.merchantId === merchantId)
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
                name="purchaseOrderDate"
                label={t("columns.purchaseOrderDate")}
                isEditing={isEditing}
                value={purchaseOrder.poDate}
                renderInput={(field) => (
                  <Input type="date" {...field} className="h-9" />
                )}
              />

              <InlineEditField
                control={form.control}
                name="amount"
                label={t("columns.totalAmount")}
                isEditing={false}
                value={`${getCurrencySymbol(currency)} ${formattedAmount(purchaseOrder.amount, currency)}`}
                renderInput={(field) => (
                  <Input {...field} className="h-9" disabled />
                )}
              />
            </div>
          </div>

          <div className="bg-card mt-6 rounded-md p-4">
            <div>
              <div className="text-sm font-semibold">{t("columns.item")}</div>
            </div>
            <div className="py-4">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t(isEditing ? "form.selectItem" : "columns.item")}
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        {t(isEditing ? "columns.quantity" : "columns.quantity")}
                      </TableHead>
                      <TableHead className="w-[160px] text-right">
                        {t(
                          isEditing ? "columns.unitPrice" : "columns.unitPrice",
                        )}
                      </TableHead>
                      <TableHead className="w-[160px] text-right">
                        {t(
                          isEditing
                            ? "columns.taxCategory"
                            : "columns.taxCategory",
                        )}
                      </TableHead>
                      <TableHead className="w-[160px] text-right">
                        {t(
                          isEditing
                            ? "columns.totalAmount"
                            : "columns.totalAmount",
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
                                          <SelectValue placeholder="Select item">
                                            {
                                              availableItems.find(
                                                (it) => it.id === field.value,
                                              )?.name
                                            }
                                          </SelectValue>
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
                              {`${getCurrencySymbol(currency)} ${formattedAmount(
                                (form.getValues(`items.${index}.quantity`) ??
                                  0) *
                                  (form.getValues(`items.${index}.unitPrice`) ??
                                    0 *
                                      Number(
                                        taxById.rateMap.get(
                                          form.getValues(
                                            `items.${index}.taxId`,
                                          ) ?? "",
                                        ) ?? 0,
                                      )),
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
                        ))
                      : (purchaseOrder.items ?? []).map((it) => (
                          <TableRow key={it.id}>
                            <TableCell className="text-sm">
                              {it.name || "—"}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {it.quantity}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {`${getCurrencySymbol(currency)} ${formattedAmount(it.unitPrice, currency)}`}
                            </TableCell>
                            <TableCell className="text-right text-sm font-medium">
                              {taxById.map.get(it.taxId) ?? "—"}
                            </TableCell>
                            <TableCell className="text-right text-sm font-medium">
                              {`${getCurrencySymbol(currency)} ${formattedAmount(it.amount, currency)}`}
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
                    {t("form.addItem") ?? "Add Item"}
                  </Button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-end">
                <div className="text-sm font-medium">
                  {t("preview.total")}:{" "}
                  {`${getCurrencySymbol(currency)} ${formattedAmount(purchaseOrder.amount, currency)}`}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
