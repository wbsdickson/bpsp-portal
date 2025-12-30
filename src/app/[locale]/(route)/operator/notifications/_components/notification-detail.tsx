"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notification-store";

export default function NotificationDetail({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.Notifications");

  const notification = useNotificationStore((s) =>
    id ? s.getNotificationById(id) : undefined,
  );

  if (!id) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          Missing notification id.
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`/${locale}/operator/notifications`}>
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
          <Link href={`/${locale}/operator/notifications`}>
            {t("buttons.back")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background space-y-4 rounded-lg border p-4">
      <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
        <div className="md:col-span-2">
          <div className="text-muted-foreground">{t("columns.title")}</div>
          <div className="font-medium">{notification.title}</div>
        </div>

        <div>
          <div className="text-muted-foreground">
            {t("columns.publicationStartDate")}
          </div>
          <div>
            {notification.publicationStartDate
              ? new Date(notification.publicationStartDate).toLocaleString()
              : "—"}
          </div>
        </div>

        <div>
          <div className="text-muted-foreground">
            {t("columns.publicationEndDate")}
          </div>
          <div>
            {notification.publicationEndDate
              ? new Date(notification.publicationEndDate).toLocaleString()
              : "—"}
          </div>
        </div>

        <div>
          <div className="text-muted-foreground">Merchant ID</div>
          <div className="font-mono">{notification.merchantId ?? "—"}</div>
        </div>

        <div>
          <div className="text-muted-foreground">Target user type</div>
          <div>{notification.targetUserType ?? "—"}</div>
        </div>

        <div className="md:col-span-2">
          <div className="text-muted-foreground">{t("form.message")}</div>
          <div className="whitespace-pre-wrap">{notification.message}</div>
        </div>
      </div>
    </div>
  );
}
