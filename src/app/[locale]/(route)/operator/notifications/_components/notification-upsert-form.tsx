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
import type { Notification } from "@/lib/types";
import { useMerchantStore } from "@/store/merchant-store";
import { useNotificationStore } from "@/store/notification-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type UpsertMode = "create" | "edit";

type NotificationUpsertValues = {
  title: string;
  message: string;
  publicationStartDate: string;
  publicationEndDate: string;
  merchantId: string;
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

interface NotificationUpsertFormProps {
  mode: UpsertMode;
  notificationId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function NotificationUpsertForm({
  mode,
  notificationId,
  onSuccess,
  onCancel,
  isModal = false,
}: NotificationUpsertFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Notifications");

  const merchants = useMerchantStore((s) => s.merchants);

  const notification = useNotificationStore((s) =>
    notificationId ? s.getNotificationById(notificationId) : undefined,
  );
  const addNotification = useNotificationStore((s) => s.addNotification);
  const updateNotification = useNotificationStore((s) => s.updateNotification);

  const schema = React.useMemo(
    () =>
      z
        .object({
          title: z.string().min(1, t("validation.titleRequired")),
          message: z.string().min(1, t("validation.messageRequired")),
          publicationStartDate: z.string(),
          publicationEndDate: z.string(),
          merchantId: z.string(),
        })
        .superRefine((val, ctx) => {
          if (!val.publicationStartDate || !val.publicationEndDate) return;
          const start = new Date(val.publicationStartDate);
          const end = new Date(val.publicationEndDate);
          if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
            return;
          if (end.getTime() < start.getTime()) {
            ctx.addIssue({
              code: "custom",
              message: t("validation.publicationPeriodInvalid"),
              path: ["publicationEndDate"],
            });
          }
        }),
    [t],
  );

  const form = useForm<NotificationUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: notification?.title ?? "",
      message: notification?.message ?? "",
      publicationStartDate: notification?.publicationStartDate ?? "",
      publicationEndDate: notification?.publicationEndDate ?? "",
      merchantId: notification?.merchantId ?? "",
    },
  });

  useEffect(() => {
    if (mode !== "edit") return;
    form.reset({
      title: notification?.title ?? "",
      message: notification?.message ?? "",
      publicationStartDate: notification?.publicationStartDate ?? "",
      publicationEndDate: notification?.publicationEndDate ?? "",
      merchantId: notification?.merchantId ?? "",
    });
  }, [form, mode, notification]);

  const onSubmit = form.handleSubmit((values) => {
    const payload: Omit<
      Notification,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    > = {
      title: values.title.trim(),
      message: values.message,
      publicationStartDate: values.publicationStartDate || undefined,
      publicationEndDate: values.publicationEndDate || undefined,
      merchantId: values.merchantId || undefined,
      targetUserType: "merchant",
      type: "info",
      createdBy: "Admin",
    };

    if (mode === "create") {
      addNotification(payload);
      toast.success(t("messages.createSuccess"));
    } else if (notificationId) {
      updateNotification(notificationId, payload);
      toast.success(t("messages.updateSuccess"));
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push(`/${locale}/operator/notifications`);
    }
  });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push(`/${locale}/operator/notifications`);
    }
  };

  return (
    <Card className={cn(isModal && "border-none shadow-none")}>
      {!isModal && (
        <CardHeader>
          <CardTitle>
            {mode === "create" ? t("form.createTitle") : t("form.editTitle")}
          </CardTitle>
        </CardHeader>
      )}
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent className={cn(isModal && "p-0")}>
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
                name="publicationStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.publicationStartDate")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        id="publicationStartDate"
                        label={null}
                        value={asDateValue(field.value)}
                        onChange={(d) => field.onChange(d ? toYmd(d) : "")}
                        placeholder={t("columns.publicationStartDate")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publicationEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.publicationEndDate")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        id="publicationEndDate"
                        label={null}
                        value={asDateValue(field.value)}
                        onChange={(d) => field.onChange(d ? toYmd(d) : "")}
                        placeholder={t("columns.publicationEndDate")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="merchantId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("form.targetMerchant")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.allMerchants")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {merchants.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name ?? m.id}
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

          <CardFooter
            className={cn(
              "mt-4 flex items-center justify-end gap-2",
              isModal && "px-0 pb-0",
            )}
          >
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={handleCancel}
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
