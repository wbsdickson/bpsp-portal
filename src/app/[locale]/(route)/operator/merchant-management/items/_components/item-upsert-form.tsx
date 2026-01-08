"use client";

import * as React from "react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useItemStore } from "@/store/item-store";
import { useTaxStore } from "@/store/tax-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";
import { createMerchantItemSchema } from "../_lib/merchant-item-schema";

const TAX_CATEGORY_OPTIONS = ["taxable", "non_taxable"] as const;
const STATUS_OPTIONS = ["active", "inactive"] as const;

const DEFAULT_MERCHANT_ID = "u1";

export default function ItemUpsertForm({
  itemId,
  onCancel,
  onSuccess,
}: {
  itemId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Operator.Items");
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
    form.reset({
      name: item?.name ?? "",
      unitPrice: String(item?.unitPrice ?? ""),
      taxCategory: item?.taxId === "tax_00" ? "non_taxable" : "taxable",
      description: item?.description ?? "",
      status: (item?.status ?? "active") as "active" | "inactive",
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

    if (onSuccess) {
      onSuccess();
    } else {
      router.push(basePath);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
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
                    <SelectItem value="taxable">Taxable</SelectItem>
                    <SelectItem value="non_taxable">Non-taxable</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="active">
                      {t("statuses.active")}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("statuses.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("columns.description")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder=""
                    {...field}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              
              variant="outline"
              className="h-9"
              onClick={onCancel}
            >
              {t("buttons.cancel")}
            </Button>
          )}
          <Button
            type="submit"
            className="h-9"
            disabled={form.formState.isSubmitting}
          >
            {t("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
