"use client";

import { Bell, ScrollText } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNotificationStore } from "@/store/notification-store";

export function NotificationPopover() {
  const t = useTranslations("CommonComponent.NotificationPopover");
  const locale = useLocale();
  const notifications = useNotificationStore((s) => s.notifications);
  const updateNotification = useNotificationStore((s) => s.updateNotification);
  const [open, setOpen] = useState(false);

  function formatRelativeTime(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t("time.justNow");
    if (diffInSeconds < 3600)
      return t("time.minutesAgo", { count: Math.floor(diffInSeconds / 60) });
    if (diffInSeconds < 86400)
      return t("time.hoursAgo", { count: Math.floor(diffInSeconds / 3600) });
    return t("time.daysAgo", { count: Math.floor(diffInSeconds / 86400) });
  }

  const recentNotifications = notifications
    .filter((n) => !n.deletedAt)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Newest first
    })
    .slice(0, 5);

  const unreadCount = notifications.filter(
    (n) => !n.deletedAt && !n.isRead,
  ).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="hover:bg-muted-foreground/20 relative rounded-full"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600" />
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {t("title")}
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        side="top"
        align="start"
        className="w-80 overflow-hidden p-0"
      >
        <div className="flex flex-col">
          <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">{t("title")}</h3>
            <span className="text-muted-foreground text-xs">
              {t("recent", { count: recentNotifications.length })}
            </span>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <Bell className="text-muted-foreground/30 size-8 mb-2" />
                <p className="text-muted-foreground text-sm">
                  {t("noNotifications")}
                </p>
              </div>
            ) : (
              recentNotifications.map((n) => (
                <Link
                  key={n.id}
                  href={`/${locale}/merchant/notifications?id=${n.id}`}
                  onClick={() => {
                    // Mark as read when clicked
                    if (!n.isRead) {
                      updateNotification(n.id, { isRead: true });
                    }
                    setOpen(false);
                  }}
                  className="hover:bg-muted/50 flex gap-3 border-b px-4 py-3 transition-colors last:border-0 cursor-pointer"
                >
                  <div className="mt-1">
                    <ScrollText className="size-4 text-blue-500" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="truncate text-sm font-medium leading-none">
                      {n.title}
                    </p>
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {n.message}
                    </p>
                    <p className="text-muted-foreground mt-1 text-[10px]">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="bg-muted/30 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full text-xs"
              asChild
            >
              <Link
                href={`/${locale}/merchant/notifications`}
                onClick={() => setOpen(false)}
              >
                {t("viewAllNotifications")}
              </Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
