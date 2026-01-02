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
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";

const TAX_CATEGORY_OPTIONS = ["taxable", "non_taxable"] as const;
const STATUS_OPTIONS = ["active", "inactive"] as const;

const DEFAULT_MERCHANT_ID = "u1";

export default function ItemUpsertForm({ itemId }: { itemId?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Items");
  const { basePath } = useBasePath();

  const item = useItemStore((s) =>
    itemId ? s.getItemById(itemId) : undefined,
  );
  const addItem = useItemStore((s) => s.addItem);
  const updateItem = useItemStore((s) => s.updateItem);

  const taxes = useTaxStore((s) => s.taxes);

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        unitPrice: z
          .string()
          .min(1, t("validation.unitPriceRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)),
            t("validation.unitPriceInvalid"),
          ),
        taxCategory: z.enum(TAX_CATEGORY_OPTIONS),
        description: z.string(),
        status: z.enum(STATUS_OPTIONS),
      }),
    [t],
  );

  type ItemUpsertValues = z.infer<typeof schema>;

  const form = useForm<ItemUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item?.name ?? "",
      unitPrice: String(item?.unitPrice ?? ""),
      taxCategory: item?.taxId === "tax_00" ? "non_taxable" : "taxable",
      description: item?.description ?? "",
      status: item?.status ?? "active",
    },
  });

  useEffect(() => {
    form.reset({
      name: item?.name ?? "",
      unitPrice: String(item?.unitPrice ?? ""),
      taxCategory: item?.taxId === "tax_00" ? "non_taxable" : "taxable",
      description: item?.description ?? "",
      status: item?.status ?? "active",
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
      router.push(basePath);
      return;
    }

    addItem({
      merchantId: DEFAULT_MERCHANT_ID,
      name: data.name.trim(),
      unitPrice: Number(data.unitPrice),
      taxId,
      description: data.description.trim() || undefined,
      status: data.status,
    });
    toast.success(t("messages.createSuccess"));
    router.push(basePath);
  });

  const title = itemId ? t("form.editTitle") : t("form.createTitle");

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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.namePlaceholder")}
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
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("columns.description")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-4 justify-end gap-2">
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
              disabled={form.formState.isSubmitting}
            >
              {t("buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
