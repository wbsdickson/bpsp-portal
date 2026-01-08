"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
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
import { Minus, Plus, X } from "lucide-react";

import { useAppStore } from "@/lib/store";
import { useQuotationStore } from "@/store/merchant/quotation-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { generateId } from "@/lib/utils";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";
import { createMerchantPurchaseOrderSchema } from "../_lib/merchant-purchase-order-schema";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import Link from "next/link";
import { usePurchaseOrderStore } from "@/store/merchant/purchase-order-store";

type PurchaseOrderUpsertFormValues = z.infer<
  ReturnType<typeof createMerchantPurchaseOrderSchema>
>;

const DEFAULT_MERCHANT_ID = "u1";
const DEFAULT_CURRENCY = "USD";

export default function PurchaseOrderUpsertForm({
  purchaseOrderId,
}: {
  purchaseOrderId?: string;
}) {
  const router = useRouter();
  const t = useTranslations("Merchant.PurchaseOrders");
  const { basePath } = useBasePath();

  const purchaseOrder = usePurchaseOrderStore((s) =>
    purchaseOrderId ? s.getPurchaseOrderById(purchaseOrderId) : undefined,
  );
  const addPurchaseOrder = usePurchaseOrderStore((s) => s.addPurchaseOrder);
  const updatePurchaseOrder = usePurchaseOrderStore(
    (s) => s.updatePurchaseOrder,
  );

  const clients = useAppStore((s) => s.clients);
  const itemsStore = useAppStore((s) => s.items);
  const getMerchantItems = useAppStore((s) => s.getMerchantItems);
  const taxes = useAppStore((s) => s.taxes);

  const schema = React.useMemo(() => createMerchantPurchaseOrderSchema(t), [t]);

  const form = useForm<PurchaseOrderUpsertFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: purchaseOrder?.clientId ?? "",
      purchaseOrderDate:
        purchaseOrder?.poDate ?? new Date().toISOString().split("T")[0],

      items: purchaseOrder?.items.map((it) => ({
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

  const merchantId = DEFAULT_MERCHANT_ID;
  const availableItems = React.useMemo(
    () => getMerchantItems(merchantId),
    [getMerchantItems, merchantId],
  );

  const currency = DEFAULT_CURRENCY;

  const subtotal = (form.watch("items") || []).reduce((sum, item) => {
    const qty = item.quantity || 0;
    const price = item.unitPrice || 0;
    const taxId = item.taxId;
    const taxRate = taxes.find((t) => t.id === taxId)?.rate ?? 0;
    return sum + qty * price * (1 + taxRate / 100);
  }, 0);

  const onSubmit = form.handleSubmit((data) => {
    const totalAmount = data.items.reduce((sum, item) => {
      const taxRate = taxes.find((t) => t.id === item.taxId)?.rate ?? 0;
      return sum + item.quantity * item.unitPrice * (1 + taxRate / 100);
    }, 0);

    const itemRows = data.items.map((it) => ({
      id: generateId("qti"),
      purchaseOrderId: purchaseOrderId ?? "",
      itemId: it.itemId,
      name: it.description || "",
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      taxId: it.taxId ?? "",
      amount:
        it.quantity *
        it.unitPrice *
        (1 + (taxes.find((t) => t.id === it.taxId)?.rate ?? 0) / 100),
    }));

    if (purchaseOrder?.id) {
      updatePurchaseOrder(purchaseOrder?.id ?? "", {
        clientId: data.clientId,
        poDate: data.purchaseOrderDate,
        amount: totalAmount,
        currency,
        notes: data.notes,
        items: itemRows,
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      const generatedNumber = `QT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, "0")}`;
      addPurchaseOrder({
        merchantId,
        clientId: data.clientId,
        purchaseOrderNumber: generatedNumber,
        purchaseOrderDate: data.purchaseOrderDate,
        amount: totalAmount,
        currency,
        notes: data.notes,
        items: itemRows.map((i) => ({ ...i, quotationId: "" })),
      } as any);
      toast.success(t("messages.createSuccess"));
    }
    router.push(basePath);
  });

  const taxById = React.useMemo(() => {
    const map = new Map<string, number>();
    taxes.forEach((t) => map.set(t.id, t.rate ?? 0));
    return map;
  }, [taxes]);

  return (
    <ScrollArea className="bg-background h-[calc(100vh-120px)] rounded-lg p-4 pr-2">
      <div className="bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href={basePath}>
              <X className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex-1">
            <div className="text-xl font-bold">
              {purchaseOrder?.id
                ? t("upsert.editTitle")
                : t("upsert.createTitle")}
            </div>
          </div>

          <Button
            size="sm"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={onSubmit}
          >
            {purchaseOrder?.id
              ? t("upsert.saveChanges")
              : t("upsert.createButton")}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-8">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <section className="space-y-3">
              <div className="text-sm font-semibold">
                {t("columns.clientName")}
              </div>
              <div className="max-w-sm">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder={t("form.selectClient")} />
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
            </section>

            <section className="space-y-3">
              <div className="text-sm font-semibold">
                {t("columns.purchaseOrderDate")}
              </div>
              <div className="max-w-sm">
                <FormField
                  control={form.control}
                  name="purchaseOrderDate"
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
              <div className="text-sm font-semibold">{t("columns.item")}</div>
              <div className="flex flex-col gap-3">
                <div className="bg-background rounded-xl border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("form.selectItem")}</TableHead>
                        <TableHead className="w-[120px] text-right">
                          {t("columns.quantity")}
                        </TableHead>
                        <TableHead className="w-[160px] text-right">
                          {t("columns.unitPrice")}
                        </TableHead>
                        <TableHead className="w-[160px] text-right">
                          {t("columns.taxCategory")}
                        </TableHead>
                        <TableHead className="w-[160px] text-right">
                          {t("columns.totalAmount")}
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
                                type="button"
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
                                type="button"
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
                            {formattedAmount(
                              (form.getValues(`items.${index}.quantity`) ?? 0) *
                                (form.getValues(`items.${index}.unitPrice`) ??
                                  0) *
                                (1 +
                                  (taxById.get(
                                    form.getValues(`items.${index}.taxId`) ??
                                      "",
                                  ) ?? 0) /
                                    100),
                              currency,
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
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
                  <Separator />
                  <div className="mt-2 flex items-center justify-between gap-4 p-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={() =>
                        append({
                          itemId: "",
                          description: "",
                          quantity: 1,
                          unitPrice: 0,
                          taxId: taxes[0]?.id ?? "tax_default",
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("form.addItem") || "Add Item"}
                    </Button>
                    <div className="text-sm">
                      <span className="text-muted-foreground mr-2">
                        {t("preview.total") || "Total"}{" "}
                        {/* Fallback trans key */}
                      </span>
                      <span className="font-semibold">
                        {formattedAmount(subtotal, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="text-sm font-semibold">
                {t("columns.remarks")}
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormControl>
                        <Textarea
                          placeholder={t("form.remarksPlaceholder")}
                          {...field}
                          className="min-h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* <div className="flex items-center justify-end gap-2 pb-8">
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => router.push(basePath)}
              >
                {t("buttons.cancel")}
              </Button>
              <Button
                type="submit"
                className="h-9 bg-indigo-600 hover:bg-indigo-700"
              >
                {t("buttons.save")}
              </Button>
            </div> */}
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
