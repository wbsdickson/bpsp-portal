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

type ItemUpsertValues = {
  name: string;
  unitPrice: string;
  taxId: string;
};

const DEFAULT_MERCHANT_ID = "u1";

export default function ItemUpsertForm({ itemId }: { itemId?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Items");

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
        taxId: z.string().min(1, t("validation.taxRequired")),
      }),
    [t],
  );

  const form = useForm<ItemUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item?.name ?? "",
      unitPrice: String(item?.unitPrice ?? ""),
      taxId: item?.taxId ?? taxes[0]?.id ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: item?.name ?? "",
      unitPrice: String(item?.unitPrice ?? ""),
      taxId: item?.taxId ?? taxes[0]?.id ?? "",
    });
  }, [form, item, taxes]);

  const onSubmit = form.handleSubmit((data) => {
    if (itemId) {
      updateItem(itemId, {
        name: data.name.trim(),
        unitPrice: Number(data.unitPrice),
        taxId: data.taxId,
      });
      router.push(`/${locale}/operator/items`);
      return;
    }

    addItem({
      merchantId: DEFAULT_MERCHANT_ID,
      name: data.name.trim(),
      unitPrice: Number(data.unitPrice),
      taxId: data.taxId,
    });
    router.push(`/${locale}/operator/items`);
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
                name="taxId"
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
                        {taxes.map((tx) => (
                          <SelectItem key={tx.id} value={tx.id}>
                            {tx.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => router.push(`/${locale}/operator/items`)}
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
