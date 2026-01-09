"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBasePath } from "@/hooks/use-base-path";
import { uuid } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createDeliveryNoteSchema } from "../_lib/delivery-note-schema";
import { formattedAmount } from "@/lib/finance-utils";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useDeliveryNoteStore } from "@/store/delivery-note-store";

const DEFAULT_MERCHANT_ID = "u1";
const DEFAULT_CURRENCY = "USD";

function asDateValue(value: string | undefined) {
  if (!value) return undefined;
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? undefined : dt;
}

function toYmd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function DeliveryNoteUpsertForm({
  deliveryNoteId,
}: {
  deliveryNoteId?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.DeliveryNotes");
  const { basePath } = useBasePath();

  const deliveryNote = useDeliveryNoteStore((s) =>
    deliveryNoteId
      ? s.deliveryNotes.find((d) => d.id === deliveryNoteId)
      : undefined,
  );
  const addDeliveryNote = useDeliveryNoteStore((s) => s.addDeliveryNote);
  const updateDeliveryNote = useDeliveryNoteStore((s) => s.updateDeliveryNote);
  const getMerchantItems = useAppStore((s) => s.getMerchantItems);
  const clients = React.useMemo(
    () => useAppStore.getState().clients.filter((c) => !c.deletedAt),
    [],
  );
  const taxes = React.useMemo(() => useAppStore.getState().taxes, []);

  const availableItems = React.useMemo(
    () => getMerchantItems(DEFAULT_MERCHANT_ID),
    [getMerchantItems],
  );

  const formSchema = React.useMemo(
    () =>
      createDeliveryNoteSchema(t).extend({
        notes: z.string().optional(),
        uploadedPdfName: z.string().optional(),
      }),
    [t],
  );

  type DeliveryNoteUpsertValues = z.infer<typeof formSchema>;

  const form = useForm<DeliveryNoteUpsertValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryNoteNumber: deliveryNote?.deliveryNoteNumber ?? "",
      clientId: deliveryNote?.clientId ?? "",
      status: (deliveryNote?.status ?? "draft") as "draft" | "issued",
      deliveryDate: deliveryNote?.deliveryDate ?? "",
      amount: deliveryNote?.amount ?? 0,
      notes: deliveryNote?.notes ?? "",
      uploadedPdfName: deliveryNote?.uploadedPdfName ?? "",
      items: deliveryNote?.items?.map((it) => ({
        itemId: it.itemId ?? "",
        description: it.name ?? "",
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (deliveryNote) {
      form.reset({
        deliveryNoteNumber: deliveryNote.deliveryNoteNumber,
        clientId: deliveryNote.clientId,
        status: deliveryNote.status,
        deliveryDate: deliveryNote.deliveryDate,
        amount: deliveryNote.amount,
        notes: deliveryNote.notes ?? "",
        uploadedPdfName: deliveryNote.uploadedPdfName ?? "",
        items: deliveryNote.items.map((it) => ({
          itemId: it.itemId ?? "",
          description: it.name ?? "",
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          taxId: it.taxId,
        })),
      });
    }
  }, [deliveryNote, form]);

  const taxById = React.useMemo(() => {
    const map = new Map<string, number>();
    taxes.forEach((t) => map.set(t.id, t.rate ?? 0));
    return map;
  }, [taxes]);

  const subtotal = (form.watch("items") || []).reduce((sum, item) => {
    const qty = item.quantity || 0;
    const price = item.unitPrice || 0;
    const taxId = item.taxId;
    const taxRate = taxes.find((t) => t.id === taxId)?.rate ?? 0;
    return sum + qty * price * (1 + taxRate / 100);
  }, 0);

  const onSubmit = form.handleSubmit((data) => {
    let totalAmount = 0;

    const itemRows = data.items.map((it) => {
      const quantity = Number(it.quantity);
      const unitPrice = Number(it.unitPrice);
      const taxRate = taxes.find((t) => t.id === it.taxId)?.rate ?? 0;
      const amount = quantity * unitPrice * (1 + taxRate / 100);
      totalAmount += amount;

      const selectedItem = availableItems.find((x) => x.id === it.itemId);

      return {
        id: uuid("dni"),
        deliveryNoteId: deliveryNoteId ?? "",
        itemId: it.itemId,
        name: it.description || selectedItem?.name || "",
        quantity,
        unitPrice,
        taxId: it.taxId ?? "",
        amount,
      };
    });

    if (deliveryNoteId) {
      updateDeliveryNote(deliveryNoteId, {
        deliveryNoteNumber: data.deliveryNoteNumber,
        clientId: data.clientId,
        deliveryDate: data.deliveryDate,
        amount: totalAmount,
        notes: data.notes?.trim() || undefined,
        items: itemRows,
        uploadedPdfName: data.uploadedPdfName?.trim() || undefined,
      });

      toast.success(t("messages.updateSuccess"));
    } else {
      const generatedNumber = `DN-${new Date()
        .toISOString()
        .slice(0, 10)
        .replaceAll("-", "")}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

      addDeliveryNote({
        merchantId: DEFAULT_MERCHANT_ID,
        clientId: data.clientId,
        deliveryNoteNumber: data.deliveryNoteNumber || generatedNumber,
        deliveryDate: data.deliveryDate,
        status: data.status,
        amount: totalAmount,
        currency: DEFAULT_CURRENCY,
        notes: data.notes?.trim() || undefined,
        items: itemRows.map((i) => ({ ...i, deliveryNoteId: "" })),
        uploadedPdfName: data.uploadedPdfName?.trim() || undefined,
      });

      toast.success(t("messages.createSuccess"));
    }

    router.push(basePath);
  });

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
              {deliveryNoteId ? t("form.editTitle") : t("form.createTitle")}
            </div>
          </div>

          <Button
            size="sm"
            className="h-9"
            onClick={onSubmit}
            disabled={form.formState.isSubmitting}
          >
            {deliveryNoteId ? t("buttons.save") : t("buttons.create")}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-8">
        <Form {...form}>
          <form onSubmit={onSubmit} className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="deliveryNoteNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.number")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="DN-YYYYMMDD-XXX"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.client")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
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

              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.deliveryDate")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        id="deliveryDate"
                        label={null}
                        value={asDateValue(field.value)}
                        onChange={(d) => field.onChange(d ? toYmd(d) : "")}
                      />
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
                    <FormLabel>{t("columns.status")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("columns.status")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="issued">Issued</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-sm font-semibold">{t("columns.item")}</div>

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
                        {t("columns.amount")}
                      </TableHead>
                      <TableHead className="w-[44px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.itemId`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  value={field.value}
                                  onValueChange={(v) => {
                                    field.onChange(v);
                                    const selected = availableItems.find(
                                      (x) => x.id === v,
                                    );
                                    if (selected) {
                                      form.setValue(
                                        `items.${index}.description`,
                                        selected.name,
                                        { shouldDirty: true },
                                      );
                                      form.setValue(
                                        `items.${index}.unitPrice`,
                                        selected.unitPrice ?? 0,
                                        { shouldDirty: true },
                                      );
                                      form.setValue(
                                        `items.${index}.taxId`,
                                        selected.taxId,
                                        { shouldDirty: true },
                                      );
                                    }
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-9 w-full">
                                      <SelectValue
                                        placeholder={t("form.selectItem")}
                                      />
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
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                const current = Number(
                                  form.getValues(`items.${index}.quantity`) ||
                                    0,
                                );
                                form.setValue(
                                  `items.${index}.quantity`,
                                  Math.max(1, current - 1),
                                  { shouldDirty: true },
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
                                      type="number"
                                      inputMode="decimal"
                                      className="h-8 w-[64px] text-right"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
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
                              onClick={() => {
                                const current = Number(
                                  form.getValues(`items.${index}.quantity`) ||
                                    0,
                                );
                                form.setValue(
                                  `items.${index}.quantity`,
                                  current + 1,
                                  { shouldDirty: true },
                                );
                              }}
                            >
                              <Plus />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    inputMode="decimal"
                                    className="h-9 text-right"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
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
                                    <SelectTrigger className="h-9 w-full">
                                      <SelectValue
                                        placeholder={t("columns.taxCategory")}
                                      />
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
                                  form.getValues(`items.${index}.taxId`) ?? "",
                                ) ?? 0) /
                                  100),
                            DEFAULT_CURRENCY,
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
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

                <Separator />

                <div className="mt-2 flex items-center justify-between gap-4 p-2">
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
                        taxId: taxes[0]?.id ?? "tax_default",
                      })
                    }
                  >
                    <Plus />
                    {t("form.addItem") || "Add Item"}
                  </Button>
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-2">
                      {t("preview.total") || "Total"}{" "}
                    </span>
                    <span className="font-semibold">
                      {formattedAmount(subtotal, DEFAULT_CURRENCY)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="uploadedPdfName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.uploadedPdf")}</FormLabel>
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
                    {field.value ? (
                      <div className="text-muted-foreground text-xs">
                        {field.value}
                      </div>
                    ) : null}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("columns.notes")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.notesPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
