"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useItemStore } from "@/store/merchant/item-store";
import { useTaxStore } from "@/store/tax-store";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { Pen, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineEditField } from "@/components/inline-edit-field";
import { createMerchantItemSchema } from "../_lib/merchant-item-schema";

export default function ItemDetail({ itemId }: { itemId: string }) {
  const t = useTranslations("Merchant.Items");
  const { basePath } = useBasePath();

  const item = useItemStore((s) => s.getItemById(itemId));
  const updateItem = useItemStore((s) => s.updateItem);
  const taxes = useTaxStore((s) => s.taxes);

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createMerchantItemSchema(t), [t]);
  type ItemDetailValues = z.infer<typeof schema>;

  const form = useForm<ItemDetailValues>({
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
    if (item) {
      form.reset({
        name: item.name,
        unitPrice: String(item.unitPrice),
        taxCategory: item.taxId === "tax_00" ? "non_taxable" : "taxable",
        description: item.description ?? "",
        status: (item.status ?? "active") as "active" | "inactive",
      });
    }
  }, [item, form, isEditing]);

  if (!item || item.deletedAt) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        {t("messages.notFound")}
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    const taxId = data.taxCategory === "non_taxable" ? "tax_00" : "tax_10";

    updateItem(itemId, {
      name: data.name.trim(),
      unitPrice: Number(data.unitPrice),
      taxId,
      description: data.description.trim() || undefined,
      status: data.status,
    });
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{item.name}</h2>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                title={t("buttons.cancel")}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSubmit}
                title={t("buttons.save")}
                className="text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              title={t("actions.edit")}
            >
              <Pen className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="bg-card p-4 rounded-lg grid grid-cols-1 gap-6 md:grid-cols-2">
            <InlineEditField
              control={form.control}
              name="name"
              label={t("columns.name")}
              isEditing={isEditing}
              value={item.name}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="unitPrice"
              label={t("columns.unitPrice")}
              isEditing={isEditing}
              value={Number(item.unitPrice).toLocaleString()}
              renderInput={(field) => (
                <Input
                  {...field}
                  type="number"
                  inputMode="decimal"
                  className="h-9"
                />
              )}
            />

            <InlineEditField
              control={form.control}
              name="taxCategory"
              label={t("columns.taxCategory")}
              isEditing={isEditing}
              value={item.taxId === "tax_00" ? "Non-taxable" : "Taxable"}
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="taxable">{t("taxable")}</SelectItem>
                    <SelectItem value="non_taxable">{t("nonTaxable")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <InlineEditField
              control={form.control}
              name="status"
              label={t("columns.status")}
              isEditing={isEditing}
              value={
                item.status === "inactive"
                  ? t("statuses.inactive")
                  : t("statuses.active")
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
                    <SelectItem value="active">
                      {t("statuses.active")}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("statuses.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <div className="col-span-1 md:col-span-2">
              <InlineEditField
                control={form.control}
                name="description"
                label={t("columns.description")}
                isEditing={isEditing}
                value={item.description || "—"}
                renderInput={(field) => (
                  <Textarea {...field} className="min-h-[100px]" />
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
