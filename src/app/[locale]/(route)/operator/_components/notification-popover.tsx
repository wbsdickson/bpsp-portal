"use client";

import { Bell, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

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
import { useBasePath } from "@/hooks/use-base-path";

function formatRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function NotificationPopover() {
  const t = useTranslations("Operator.Sidebar.footer");
  const notifications = useNotificationStore((s) => s.notifications);
  const { basePath } = useBasePath();

  const recentNotifications = notifications
    .filter((n) => !n.deletedAt)
    .slice(0, 5);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative size-8">
              <Bell className="size-4" />
              {recentNotifications.length > 0 && (
                <span className="ring-background absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600 ring-2" />
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {t("notifications")}
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        side="top"
        align="start"
        className="w-80 overflow-hidden p-0"
      >
        <div className="flex flex-col">
          <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <span className="text-muted-foreground text-xs">
              {recentNotifications.length} recent
            </span>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <Bell className="text-muted-foreground/30 mb-2 size-8" />
                <p className="text-muted-foreground text-sm">
                  No new notifications
                </p>
              </div>
            ) : (
              recentNotifications.map((n) => (
                <div
                  key={n.id}
                  className="hover:bg-muted/50 flex gap-3 border-b px-4 py-3 transition-colors last:border-0"
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
                </div>
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
              <Link href={`/operator/notifications`}>
                View all notifications
              </Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
