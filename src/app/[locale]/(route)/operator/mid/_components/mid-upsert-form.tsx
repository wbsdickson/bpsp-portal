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
import { useMidStore } from "@/store/mid-store";
import type { MidStatus } from "@/types/mid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

type MidUpsertValues = {
  mid: string;
  brand: string;
  connectionEndpoint: string;
  status: MidStatus;
};

const STATUS_OPTIONS: MidStatus[] = ["active", "inactive"];

export default function MidUpsertForm({ midId }: { midId?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.MID");

  const existing = useMidStore((s) =>
    midId ? s.getMidById(midId) : undefined,
  );
  const addMid = useMidStore((s) => s.addMid);
  const updateMid = useMidStore((s) => s.updateMid);

  const schema = React.useMemo(
    () =>
      z.object({
        mid: z.string().min(1, t("validation.midRequired")),
        brand: z.string().min(1, t("validation.brandRequired")),
        connectionEndpoint: z
          .string()
          .min(1, t("validation.connectionEndpointRequired")),
        status: z.enum(["active", "inactive"]),
      }),
    [t],
  );

  const form = useForm<MidUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mid: existing?.mid ?? "",
      brand: existing?.brand ?? "",
      connectionEndpoint: existing?.connectionEndpoint ?? "",
      status: (existing?.status ?? "active") as MidStatus,
    },
  });

  useEffect(() => {
    form.reset({
      mid: existing?.mid ?? "",
      brand: existing?.brand ?? "",
      connectionEndpoint: existing?.connectionEndpoint ?? "",
      status: (existing?.status ?? "active") as MidStatus,
    });
  }, [existing, form]);

  const onSubmit = form.handleSubmit((data) => {
    if (midId) {
      updateMid(midId, {
        mid: data.mid.trim(),
        brand: data.brand.trim(),
        connectionEndpoint: data.connectionEndpoint.trim(),
        status: data.status,
      });
      toast.success(t("messages.updateSuccess"));
      router.push(`/${locale}/operator/mid`);
      return;
    }

    addMid({
      mid: data.mid.trim(),
      brand: data.brand.trim(),
      connectionEndpoint: data.connectionEndpoint.trim(),
      status: data.status,
      linkedMerchantIds: [],
    });
    toast.success(t("messages.createSuccess"));
    router.push(`/${locale}/operator/mid`);
  });

  const title = midId ? t("form.editTitle") : t("form.createTitle");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="mid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.mid")}</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.brand")}</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="connectionEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.connectionEndpoint")}</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
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
                  <FormLabel>{t("form.status")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={t("form.status")} />
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

            <CardFooter className="justify-end gap-2 px-0">
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => router.push(`/${locale}/operator/mid`)}
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
      </CardContent>
    </Card>
  );
}
