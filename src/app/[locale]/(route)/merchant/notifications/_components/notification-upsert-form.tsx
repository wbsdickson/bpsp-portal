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
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { MerchantNotification } from "@/lib/types";
import { useMerchantStore } from "@/store/merchant-store";
import { useNotificationStore } from "@/store/merchant/notification-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type UpsertMode = "create" | "edit";

type NotificationUpsertValues = {
  title: string;
  message: string;
  publicationDate: string;
  readStatus: boolean;
  target: string;
  merchantId: string;
  createdBy: string;
};

function toYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function asDateValue(input: string | undefined) {
  if (!input) return undefined;
  const dt = new Date(input);
  if (Number.isNaN(dt.getTime())) return undefined;
  return dt;
}

export default function NotificationUpsertForm({
  mode,
  notificationId,
}: {
  mode: UpsertMode;
  notificationId?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.Notifications");

  const merchants = useMerchantStore((s) => s.merchants);

  const notification = useNotificationStore((s) =>
    notificationId ? s.getNotificationById(notificationId) : undefined,
  );
  const addNotification = useNotificationStore((s) => s.addNotification);
  const updateNotification = useNotificationStore((s) => s.updateNotification);

  const schema = React.useMemo(
    () =>
      z.object({
        title: z.string().min(1, t("validation.titleRequired")),
        message: z.string().min(1, t("validation.messageRequired")),
        publicationDate: z.string(),
        readStatus: z.boolean(),
        target: z.string(),
        merchantId: z.string(),
        createdBy: z.string(),
      }),
    [t],
  );

  const form = useForm<NotificationUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: notification?.title ?? "",
      message: notification?.message ?? "",
      publicationDate: notification?.publicationDate ?? "",
      readStatus: notification?.readStatus ?? false,
      target: notification?.target ?? "",
      merchantId: notification?.merchantId ?? "",
      createdBy: notification?.createdBy ?? "",
    },
  });

  useEffect(() => {
    if (mode !== "edit") return;
    form.reset({
      title: notification?.title ?? "",
      message: notification?.message ?? "",
      publicationDate: notification?.publicationDate ?? "",
      readStatus: notification?.readStatus ?? false,
      target: notification?.target ?? "",
      merchantId: notification?.merchantId ?? "",
      createdBy: notification?.createdBy ?? "",
    });
  }, [form, mode, notification]);

  const onSubmit = form.handleSubmit((values) => {
    const payload: Omit<
      MerchantNotification,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    > = {
      title: values.title.trim(),
      message: values.message,
      publicationDate: values.publicationDate || "",
      readStatus: values.readStatus || false,
      target: values.target || "",
      merchantId: values.merchantId || "",
      createdBy: values.createdBy || "",
    };

    if (mode === "create") {
      addNotification(payload);
      toast.success(t("messages.createSuccess"));
    } else if (notificationId) {
      updateNotification(notificationId, payload);
      toast.success(t("messages.updateSuccess"));
    }

    router.push(`/${locale}/merchant/notifications`);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? t("form.createTitle") : t("form.editTitle")}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("columns.title")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.titlePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("form.message")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.messagePlaceholder")}
                        className="min-h-[140px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publicationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.publicationDate")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        id="publicationDate"
                        label={null}
                        value={asDateValue(field.value)}
                        onChange={(d) => field.onChange(d ? toYmd(d) : "")}
                        placeholder={t("columns.publicationDate")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="readStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.readStatus")}</FormLabel>
                    <FormControl>
                      <Badge variant={field.value ? "success" : "secondary"}>
                        {field.value ? "Read" : "Unread"}
                      </Badge>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              className="h-9"
              onClick={() => router.push(`/${locale}/merchant/notifications`)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button type="submit" className="h-9">
              {t("buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
