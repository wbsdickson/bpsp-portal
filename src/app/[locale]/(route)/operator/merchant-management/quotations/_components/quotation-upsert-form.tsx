"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientStore } from "@/store/client-store";
import { useItemStore } from "@/store/item-store";
import { useQuotationStore } from "@/store/quotation-store";
import { useTaxStore } from "@/store/tax-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";

const TAX_CATEGORY_OPTIONS = ["taxable", "non_taxable"] as const;

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

export default function QuotationUpsertForm({
  quotationId,
}: {
  quotationId?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Quotations");
  const { basePath } = useBasePath();

  const quotation = useQuotationStore((s) =>
    quotationId ? s.getQuotationById(quotationId) : undefined,
  );
  const addQuotation = useQuotationStore((s) => s.addQuotation);
  const updateQuotation = useQuotationStore((s) => s.updateQuotation);

  const clients = useClientStore((s) => s.clients);
  const items = useItemStore((s) => s.items);
  const taxes = useTaxStore((s) => s.taxes);

  const activeItems = React.useMemo(
    () => items.filter((it) => !it.deletedAt),
    [items],
  );

  const schema = React.useMemo(
    () =>
      z.object({
        clientId: z.string().min(1, t("validation.clientRequired")),
        quotationDate: z.string().min(1, t("validation.issueDateRequired")),
        itemId: z.string().min(1, t("validation.itemRequired")),
        quantity: z
          .string()
          .min(1, t("validation.quantityRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)) && Number(v) > 0,
            t("validation.quantityInvalid"),
          ),
        unitPrice: z
          .string()
          .min(1, t("validation.unitPriceRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)) && Number(v) >= 0,
            t("validation.unitPriceInvalid"),
          ),
        taxCategory: z.enum(TAX_CATEGORY_OPTIONS),
        remarks: z.string(),
        uploadedPdfName: z.string(),
      }),
    [t],
  );

  type QuotationUpsertValues = z.infer<typeof schema>;

  const currentItemId = quotation?.items?.[0]?.itemId ?? "";
  const currentItemName = quotation?.items?.[0]?.name ?? "";
  const currentItem = React.useMemo(() => {
    if (!currentItemId) return undefined;
    return activeItems.find((it) => it.id === currentItemId);
  }, [activeItems, currentItemId]);

  const selectedTaxId = quotation?.items?.[0]?.taxId;
  const taxCategoryDefault =
    selectedTaxId === "tax_00" ? "non_taxable" : "taxable";

  const form = useForm<QuotationUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: quotation?.clientId ?? "",
      quotationDate: quotation?.quotationDate ?? "",
      itemId: currentItemId,
      quantity: String(quotation?.items?.[0]?.quantity ?? ""),
      unitPrice: String(
        quotation?.items?.[0]?.unitPrice ?? currentItem?.unitPrice ?? "",
      ),
      taxCategory: taxCategoryDefault,
      remarks: quotation?.notes ?? "",
      uploadedPdfName: quotation?.uploadedPdfName
        ? String(quotation.uploadedPdfName)
        : "",
    },
  });

  useEffect(() => {
    form.reset({
      clientId: quotation?.clientId ?? "",
      quotationDate: quotation?.quotationDate ?? "",
      itemId: currentItemId,
      quantity: String(quotation?.items?.[0]?.quantity ?? ""),
      unitPrice: String(
        quotation?.items?.[0]?.unitPrice ?? currentItem?.unitPrice ?? "",
      ),
      taxCategory: taxCategoryDefault,
      remarks: quotation?.notes ?? "",
      uploadedPdfName: quotation?.uploadedPdfName
        ? String(quotation.uploadedPdfName)
        : "",
    });
  }, [
    form,
    quotation,
    currentItemId,
    currentItem?.unitPrice,
    taxCategoryDefault,
  ]);

  const title = quotationId ? t("form.editTitle") : t("form.createTitle");

  const onSubmit = form.handleSubmit((data) => {
    const taxId = data.taxCategory === "non_taxable" ? "tax_00" : "tax_10";
    const quantity = Number(data.quantity);
    const unitPrice = Number(data.unitPrice);
    const amount = quantity * unitPrice;

    const selectedItem = activeItems.find((it) => it.id === data.itemId);
    const itemName = (selectedItem?.name ?? currentItemName) || "";

    const itemRow = {
      id: "qti_1",
      quotationId: quotationId ?? "",
      itemId: data.itemId,
      name: itemName,
      quantity,
      unitPrice,
      taxId,
      amount,
    };

    if (quotationId) {
      updateQuotation(quotationId, {
        clientId: data.clientId,
        quotationDate: data.quotationDate,
        amount,
        notes: data.remarks.trim() || undefined,
        items: [
          {
            ...itemRow,
            quotationId,
          },
        ],
        ...(data.uploadedPdfName.trim()
          ? ({
              uploadedPdfName: data.uploadedPdfName.trim(),
            } as unknown as object)
          : ({ uploadedPdfName: undefined } as unknown as object)),
      });

      toast.success(t("messages.updateSuccess"));

      router.push(basePath);
      return;
    }

    const generatedNumber = `QT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(
      Math.random() * 1000,
    )
      .toString()
      .padStart(3, "0")}`;

    addQuotation({
      merchantId: DEFAULT_MERCHANT_ID,
      clientId: data.clientId,
      quotationNumber: generatedNumber,
      quotationDate: data.quotationDate,
      status: "draft",
      amount,
      currency: DEFAULT_CURRENCY,
      notes: data.remarks.trim() || undefined,
      uploadedPdfName: data.uploadedPdfName.trim() || undefined,
      items: [
        {
          ...itemRow,
          quotationId: "",
        },
      ],
    } as unknown as Parameters<typeof addQuotation>[0]);

    toast.success(t("messages.createSuccess"));

    router.push(basePath);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                name="quotationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.quotationDate")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        id="quotationDate"
                        label={null}
                        value={asDateValue(field.value)}
                        onChange={(d) => field.onChange(d ? toYmd(d) : "")}
                        placeholder={t("columns.quotationDate")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.item")}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        const it = activeItems.find((x) => x.id === v);
                        if (it?.unitPrice != null) {
                          form.setValue("unitPrice", String(it.unitPrice), {
                            shouldDirty: true,
                          });
                        }
                        form.setValue(
                          "taxCategory",
                          it?.taxId === "tax_00" ? "non_taxable" : "taxable",
                          {
                            shouldDirty: true,
                          },
                        );
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectItem")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeItems.map((it) => (
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

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.quantity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder={t("form.quantityPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.unitPrice")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder={t("form.unitPricePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.taxCategory")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("columns.taxCategory")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="taxable">Taxable</SelectItem>
                        <SelectItem value="non_taxable">Non-taxable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <div className="text-muted-foreground text-xs">
                      {field.value === "non_taxable"
                        ? (taxes.find((x) => x.id === "tax_00")?.name ??
                          "tax_00")
                        : (taxes.find((x) => x.id === "tax_10")?.name ??
                          "tax_10")}
                    </div>
                  </FormItem>
                )}
              />

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
                name="remarks"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("columns.remarks")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.remarksPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-4 flex items-center justify-end gap-2">
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
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
