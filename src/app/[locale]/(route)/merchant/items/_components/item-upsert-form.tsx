"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";

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
import { useItemStore } from "@/store/merchant/item-store";
import { useTaxStore } from "@/store/tax-store";
import { useBasePath } from "@/hooks/use-base-path";
import { createMerchantItemSchema } from "../_lib/merchant-item-schema";

const DEFAULT_MERCHANT_ID = "u1";

export default function ItemUpsertForm({
  itemId,
}: {
  itemId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Merchant.Items");
  const { basePath } = useBasePath();

  const item = useItemStore((s) =>
    itemId ? s.getItemById(itemId) : undefined,
  );
  const addItem = useItemStore((s) => s.addItem);
  const updateItem = useItemStore((s) => s.updateItem);
  const taxes = useTaxStore((s) => s.taxes);

  const schema = React.useMemo(() => createMerchantItemSchema(t), [t]);
  type ItemUpsertValues = z.infer<typeof schema>;

  const form = useForm<ItemUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item?.name ?? "",
      unitPrice: String(item?.unitPrice ?? ""),
      taxCategory: item?.taxId === "tax_00" ? "non_taxable" : "taxable",
      description: item?.description ?? "",
      status: (item?.status ?? "active") as "active" | "inactive",
    },
  });

  useEffect(() => {
    if (!item) return;

    form.reset({
      name: item.name ?? "",
      unitPrice: String(item.unitPrice ?? ""),
      taxCategory: item.taxId === "tax_00" ? "non_taxable" : "taxable",
      description: item.description ?? "",
      status: (item.status ?? "active") as "active" | "inactive",
    });
  }, [form, item, taxes]);

  const onSubmit = form.handleSubmit((data) => {
    const taxId = data.taxCategory === "non_taxable" ? "tax_00" : "tax_10";

    if (itemId) {
      updateItem(itemId, {
        name: data.name.trim(),
        unitPrice: Number(data.unitPrice),
        taxId,
        description: data.description.trim() || undefined,
        status: data.status,
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      addItem({
        merchantId: DEFAULT_MERCHANT_ID,
        name: data.name.trim(),
        unitPrice: Number(data.unitPrice),
        taxId,
        description: data.description.trim() || undefined,
        status: data.status,
      });
      toast.success(t("messages.createSuccess"));
    }

    router.push(basePath);
  });

  return (
    <div className="bg-card min-h-[calc(100vh-0px)] rounded-lg p-4">
      <div className="bg-card/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => router.back()}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <div className="text-xl font-bold">
              {itemId ? t("form.editTitle") : t("form.createTitle")}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-4 pb-2">
          <Button
            size="sm"
            className="h-9"
            onClick={onSubmit}
            disabled={form.formState.isSubmitting}
          >
            {itemId ? t("buttons.saveChanges") : t("buttons.create")}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.namePlaceholder")}
                        className="h-9"
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
                        className="h-9"
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
                          <SelectValue placeholder={t("form.selectTax")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="taxable">{t("taxable")}</SelectItem>
                        <SelectItem value="non_taxable">
                          {t("nonTaxable")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
