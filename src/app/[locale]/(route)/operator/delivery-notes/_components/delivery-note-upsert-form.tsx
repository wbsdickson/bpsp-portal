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
import { useClientStore, type ClientStoreState } from "@/store/client-store";
import { useDeliveryNoteStore } from "@/store/delivery-note-store";
import type { Client, DeliveryNoteStatus } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type DeliveryNoteUpsertValues = {
  deliveryNoteNumber: string;
  clientId: string;
  amount: string;
  deliveryDate: string;
  status: DeliveryNoteStatus;
};

const STATUS_OPTIONS: DeliveryNoteStatus[] = ["draft", "issued"];

const selectClients = (s: ClientStoreState) => s.clients;

export default function DeliveryNoteUpsertForm({
  deliveryNoteId,
}: {
  deliveryNoteId: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.DeliveryNotes");

  const deliveryNote = useDeliveryNoteStore((s) =>
    s.getDeliveryNoteById(deliveryNoteId),
  );
  const updateDeliveryNote = useDeliveryNoteStore((s) => s.updateDeliveryNote);

  const allClients = useClientStore(selectClients);
  const clients = React.useMemo(
    () => allClients.filter((c: Client) => !c.deletedAt),
    [allClients],
  );

  const schema = React.useMemo(
    () =>
      z.object({
        deliveryNoteNumber: z.string().min(1, t("validation.numberRequired")),
        clientId: z.string().min(1, t("validation.clientRequired")),
        amount: z
          .string()
          .min(1, t("validation.amountRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)),
            t("validation.amountInvalid"),
          ),
        deliveryDate: z.string().min(1, t("validation.issueDateRequired")),
        status: z.enum(["draft", "issued"]),
      }),
    [t],
  );

  const form = useForm<DeliveryNoteUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      deliveryNoteNumber: deliveryNote?.deliveryNoteNumber ?? "",
      clientId: deliveryNote?.clientId ?? "",
      amount: String(deliveryNote?.amount ?? ""),
      deliveryDate: deliveryNote?.deliveryDate ?? "",
      status: (deliveryNote?.status ?? "draft") as DeliveryNoteStatus,
    },
  });

  useEffect(() => {
    form.reset({
      deliveryNoteNumber: deliveryNote?.deliveryNoteNumber ?? "",
      clientId: deliveryNote?.clientId ?? "",
      amount: String(deliveryNote?.amount ?? ""),
      deliveryDate: deliveryNote?.deliveryDate ?? "",
      status: (deliveryNote?.status ?? "draft") as DeliveryNoteStatus,
    });
  }, [form, deliveryNote]);

  const onSubmit = form.handleSubmit((data) => {
    updateDeliveryNote(deliveryNoteId, {
      deliveryNoteNumber: data.deliveryNoteNumber.trim(),
      clientId: data.clientId,
      amount: Number(data.amount),
      deliveryDate: data.deliveryDate,
      status: data.status,
    });

    router.push(`/${locale}/operator/delivery-notes`);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.editTitle")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="deliveryNoteNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.number")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.numberPlaceholder")}
                        {...field}
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
                    <FormLabel>{t("columns.issueDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.amount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder={t("form.amountPlaceholder")}
                        {...field}
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
                          <SelectValue placeholder={t("form.selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {t(`statuses.${s}`)}
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
              onClick={() => router.push(`/${locale}/operator/delivery-notes`)}
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
