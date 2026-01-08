"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Eye, EyeOff, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { useAppStore } from "@/lib/store";
import { useInvoiceStore } from "@/store/invoice-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { absoluteUrl, generateId } from "@/lib/utils";
import { useBasePath } from "@/hooks/use-base-path";
import { formatDate } from "@/lib/date-utils";
import { toast } from "sonner";
import CreateInvoiceForm from "./invoice-create";
import InvoicePreview from "./invoice-preview";

const lineItemFormSchema = z.object({
  itemId: z.string().optional(),
  description: z.string().optional(),
  transactionDate: z.string().optional(),
  quantity: z.number().min(1),
  unit: z.string().optional(),
  unitPrice: z.number().min(0),
  taxId: z.string().optional(),
  withholdingTax: z.boolean().optional(),
});

const invoiceUpsertFormSchema = z.object({
  merchantId: z.string().min(1),
  clientId: z.string().min(1),
  honorific: z.string().optional(),
  invoiceDate: z.string().min(1),
  dueDate: z.string().optional(),
  subject: z.string().optional(),
  amount: z.number().min(0),
  currency: z.string().min(1),
  updatedAt: z.string().optional(),
  invoiceNumber: z.string().min(1),
  items: z.array(lineItemFormSchema).min(1),
  bankAccountId: z.string().optional(),
  remark: z.string().optional(),
});

type InvoiceUpsertFormValues = z.infer<typeof invoiceUpsertFormSchema>;

export function InvoiceUpsertPage({
  invoiceId,
  onClose,
}: {
  invoiceId?: string;
  onClose?: () => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Invoice");
  const { basePath } = useBasePath();

  const merchants = useAppStore((s) => s.merchants);
  const customers = useAppStore((s) => s.clients);
  const taxes = useAppStore((s) => s.taxes);
  const getMerchantItems = useAppStore((s) => s.getMerchantItems);
  const getMerchantBankAccounts = useAppStore((s) => s.getMerchantBankAccounts);

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
      honorific: "御中",
      invoiceDate:
        invoiceToEdit?.invoiceDate ?? formatDate(new Date().toISOString()),
      dueDate: invoiceToEdit?.dueDate ?? "",
      subject: "",
      invoiceNumber: invoiceToEdit?.invoiceNumber ?? generateId("inv"),
      amount: invoiceToEdit?.amount ?? 0,
      currency: invoiceToEdit?.currency ?? "JPY",
      updatedAt: invoiceToEdit?.updatedAt,
      items: invoiceToEdit?.items.map((it) => ({
        itemId: it.itemId,
        description: it.name,
        transactionDate: "",
        quantity: it.quantity,
        unit: "",
        unitPrice: it.unitPrice,
        taxId: it.taxId,
        withholdingTax: false,
      })) ?? [
        {
          itemId: "",
          description: "",
          transactionDate: "",
          quantity: 1,
          unit: "",
          unitPrice: 0,
          taxId: taxes[0]?.id ?? "tax_default",
          withholdingTax: false,
        },
      ],
      bankAccountId: "",
      remark: "",
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
      honorific: "御中",
      invoiceDate: invoiceToEdit.invoiceDate,
      dueDate: invoiceToEdit.dueDate ?? "",
      subject: "",
      amount: invoiceToEdit.amount,
      currency: invoiceToEdit.currency,
      updatedAt: invoiceToEdit.updatedAt,
      invoiceNumber: invoiceToEdit.invoiceNumber,
      items: invoiceToEdit.items.map((it) => ({
        itemId: it.itemId,
        description: it.name,
        transactionDate: "",
        quantity: it.quantity,
        unit: "",
        unitPrice: it.unitPrice,
        taxId: it.taxId,
        withholdingTax: false,
      })),
      bankAccountId: "",
      remark: "",
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

  const bankAccounts = React.useMemo(
    () => getMerchantBankAccounts(selectedMerchantId),
    [getMerchantBankAccounts, selectedMerchantId],
  );

  const selectedMerchant = React.useMemo(
    () => merchants.find((m) => m.id === selectedMerchantId) ?? null,
    [merchants, selectedMerchantId],
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

  const [showPreview, setShowPreview] = React.useState(false);

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
          transactionDate: it.transactionDate || undefined,
          quantity,
          unit: it.unit || undefined,
          unitPrice,
          taxId,
          withholdingTax: it.withholdingTax ?? false,
          amount: base + taxAmount,
        };
      },
    );

    if (invoiceId) {
      updateInvoice(invoiceId, {
        merchantId: data.merchantId,
        clientId: data.clientId,
        honorific: data.honorific || undefined,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate || undefined,
        subject: data.subject || undefined,
        amount: subtotal,
        currency: data.currency,
        items: storeItems,
        bankAccountId: data.bankAccountId || undefined,
        remark: data.remark || undefined,
        updatedAt: now.toISOString(),
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      const path = absoluteUrl(`/invoice/${data.invoiceNumber}`);
      addInvoice({
        merchantId: data.merchantId,
        clientId: data.clientId,
        honorific: data.honorific || undefined,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate || undefined,
        subject: data.subject || undefined,
        direction: "receivable",
        amount: subtotal,
        currency: data.currency,
        items: storeItems,
        invoiceNumber: data.invoiceNumber,
        bankAccountId: data.bankAccountId || undefined,
        remark: data.remark || undefined,
        fileUrl: path,
      });
      toast.success(t("messages.createSuccess"));
    }

    if (onClose) {
      onClose();
    } else {
      router.push(basePath);
    }
  });

  return (
    <div className="bg-background min-h-[calc(100vh-0px)] overflow-hidden rounded-lg">
      <div className="bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          {onClose ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href={basePath}>
                <X className="h-4 w-4" />
              </Link>
            </Button>
          )}

          <div className="flex-1">
            <div className="text-sm font-medium">
              {invoiceId ? t("upsert.editTitle") : t("upsert.createTitle")}
            </div>
          </div>

          <Button
            
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                {t("upsert.hidePreview")}
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                {t("upsert.showPreview")}
              </>
            )}
          </Button>

          <Button
            size="sm"
            className="h-9"
            onClick={onSubmit}
          >
            {invoiceId ? t("upsert.saveChanges") : t("upsert.createButton")}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1">
          {!showPreview ? (
            <CreateInvoiceForm
              form={form}
              merchants={merchants}
              availableCustomers={availableCustomers}
              availableItems={availableItems}
              taxes={taxes}
              bankAccounts={bankAccounts}
              selectedMerchant={selectedMerchant}
              subtotal={subtotal}
              itemFields={itemFields}
              onAddItem={() =>
                append({
                  itemId: "",
                  description: "",
                  transactionDate: "",
                  quantity: 1,
                  unit: "",
                  unitPrice: 0,
                  taxId: taxes[0]?.id ?? "tax_default",
                  withholdingTax: false,
                })
              }
              onRemoveItem={(index) => remove(index)}
            />
          ) : (
            <InvoicePreview
              customer={customer}
              currency={currency}
              subtotal={subtotal}
              invoiceNumber={form.getValues("invoiceNumber")}
              taxes={taxes}
              items={(items ?? []).map(
                (
                  it: InvoiceUpsertFormValues["items"][number],
                  idx: number,
                ) => ({
                  id: `item_${idx + 1}`,
                  description: it.description ?? "",
                  transactionDate: it.transactionDate ?? "",
                  quantity: it.quantity ?? 0,
                  unit: it.unit ?? "",
                  unitPrice: it.unitPrice ?? 0,
                  taxId: it.taxId ?? "",
                  withholdingTax: it.withholdingTax ?? false,
                }),
              )}
            />
          )}
        </div>
      </Form>
    </div>
  );
}
