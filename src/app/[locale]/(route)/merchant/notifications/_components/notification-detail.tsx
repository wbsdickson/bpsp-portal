"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/merchant/notification-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotificationSchema } from "../_lib/notification-schema";
import { Badge } from "@/components/ui/badge";

export default function NotificationDetail({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("Merchant.Notifications");

  const notification = useNotificationStore((s) =>
    id ? s.getNotificationById(id) : undefined,
  );

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createNotificationSchema(t), [t]);
  type NotificationDetailValues = z.infer<typeof schema>;

  const form = useForm<NotificationDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: notification?.title ?? "",
      message: notification?.message ?? "",
      merchantId: notification?.merchantId ?? "",
      target: notification?.target ?? "",
      publicationDate: notification?.publicationDate ?? "",
      readStatus: notification?.readStatus ?? false,
    },
  });

  useEffect(() => {
    if (notification) {
      form.reset({
        title: notification.title,
        message: notification.message,
        merchantId: notification.merchantId ?? "",
        target: notification.target ?? "",
        publicationDate: notification.publicationDate ?? "",
        readStatus: notification.readStatus ?? false,
      });
    }
  }, [notification, form, isEditing]);

  if (!id) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("missingNotificationId")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`/${locale}/merchant/notifications`}>
            {t("buttons.back")}
          </Link>
        </Button>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`/${locale}/merchant/notifications`}>
            {t("buttons.back")}
          </Link>
        </Button>
      </div>
    );
  }

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <div className="bg-card space-y-4 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {notification.title}
          </h2>
          <Badge variant={notification.readStatus ? "success" : "secondary"}>
            {notification.readStatus
              ? t("statuses.read")
              : t("statuses.unread")}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="text-muted-foreground text-xs">
            {t("columns.title")}
          </div>
          <div className="font-medium">{notification.title}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("columns.body")}
          </div>
          <div className="font-medium">{notification.message}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("columns.publicationDate")}
          </div>
          <div className="font-medium">{notification.publicationDate}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("columns.updatedDate")}
          </div>
          <div className="font-medium">{notification.updatedAt ?? "—"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("columns.readStatus")}
          </div>
          <div className="font-medium">
            <Badge variant={notification.readStatus ? "success" : "secondary"}>
              {notification.readStatus
                ? t("statuses.read")
                : t("statuses.unread")}
            </Badge>
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("columns.createdBy")}
          </div>
          <div className="font-medium">{notification.createdBy}</div>
        </div>
      </div>
    </div>
  );
}
