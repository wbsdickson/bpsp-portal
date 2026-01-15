"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useNotificationStore } from "@/store/notification-store";
import { Mail, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import HeaderPage from "@/components/header-page";
import type { Notification } from "@/lib/types";

function formatRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function getTypeColor(type: Notification["type"]) {
  switch (type) {
    case "success":
      return "bg-green-500";
    case "warning":
      return "bg-yellow-500";
    case "error":
      return "bg-red-500";
    default:
      return "bg-blue-500";
  }
}

export default function NotificationsPage() {
  const t = useTranslations("Merchant.Notifications");
  const notifications = useNotificationStore((s) => s.notifications);
  const updateNotification = useNotificationStore((s) => s.updateNotification);
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Read notification ID from URL query parameter
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setSelectedId(idFromUrl);
      // Mark as read when opened from URL
      const notification = notifications.find((n) => n.id === idFromUrl);
      if (notification && !notification.isRead) {
        updateNotification(idFromUrl, { isRead: true });
      }
    }
  }, [searchParams, notifications, updateNotification]);

  const allNotifications = useMemo(() => {
    return notifications.filter((n) => !n.deletedAt);
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    let filtered = allNotifications;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query),
      );
    }

    // Apply tab filtering
    if (activeTab === "unread") {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (activeTab === "archive") {
      filtered = filtered.filter((n) => n.isRead);
    }

    return filtered;
  }, [allNotifications, searchQuery, activeTab]);

  // Calculate counts for each tab
  const counts = useMemo(() => {
    const all = allNotifications.length;
    const unread = allNotifications.filter((n) => !n.isRead).length;
    const archive = allNotifications.filter((n) => n.isRead).length;
    return { all, unread, archive };
  }, [allNotifications]);

  const selectedNotification = useMemo(
    () => notifications.find((n) => n.id === selectedId),
    [notifications, selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const notification = notifications.find((n) => n.id === id);
    if (notification && !notification.isRead) {
      updateNotification(id, { isRead: true });
    }
  };

  return (
    <HeaderPage title={t("title") || "Notifications"}>
      <div className="bg-card h-[calc(100vh-10rem)] overflow-hidden rounded-lg border">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* List View */}
          <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
            <div className="flex h-full flex-col">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex h-full flex-col"
              >
                <div className="flex items-center py-2">
                  <TabsList variant="outline">
                    <TabsTrigger value="all" variant="outline">
                      All
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        {counts.all}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="unread" variant="outline">
                      Unread
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        {counts.unread}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="archive" variant="outline">
                      Archive
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        {counts.archive}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="p-4 backdrop-blur">
                  <div className="relative">
                    <Search className="text-muted-foreground size-4 absolute left-2 top-2.5" />
                    <Input
                      placeholder="Search"
                      className="bg-card pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <TabsContent
                  value="all"
                  className="m-0 min-h-0 flex-1 overflow-hidden"
                >
                  <ScrollArea className="h-full">
                    {filteredNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Mail className="text-muted-foreground/30 size-12 mb-4" />
                        <p className="text-muted-foreground text-sm">
                          No notifications
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredNotifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => handleSelect(notification.id)}
                            className={cn(
                              "hover:bg-accent/50 w-full p-4 text-left transition-colors",
                              selectedId === notification.id && "bg-accent",
                              !notification.isRead && "bg-muted",
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  "mt-1 size-2 rounded-full",
                                  getTypeColor(notification.type),
                                )}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p
                                    className={cn(
                                      "truncate text-sm font-medium",
                                      !notification.isRead && "font-semibold",
                                    )}
                                  >
                                    {notification.title}
                                  </p>
                                  <span className="text-muted-foreground shrink-0 text-xs">
                                    {formatRelativeTime(notification.createdAt)}
                                  </span>
                                </div>
                                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                                  {notification.message}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent
                  value="unread"
                  className="m-0 min-h-0 flex-1 overflow-hidden"
                >
                  <ScrollArea className="h-full">
                    {filteredNotifications.filter((n) => !n.isRead).length ===
                    0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Mail className="text-muted-foreground/30 size-12 mb-4" />
                        <p className="text-muted-foreground text-sm">
                          No unread notifications
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredNotifications
                          .filter((n) => !n.isRead)
                          .map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleSelect(notification.id)}
                              className={cn(
                                "hover:bg-accent/50 w-full p-4 text-left transition-colors",
                                selectedId === notification.id && "bg-accent",
                                "bg-muted/30",
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={cn(
                                    "mt-1 size-2 rounded-full",
                                    getTypeColor(notification.type),
                                  )}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-sm font-semibold">
                                      {notification.title}
                                    </p>
                                    <span className="text-muted-foreground shrink-0 text-xs">
                                      {formatRelativeTime(
                                        notification.createdAt,
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent
                  value="archive"
                  className="m-0 min-h-0 flex-1 overflow-hidden"
                >
                  <ScrollArea className="h-full">
                    {filteredNotifications.filter((n) => n.isRead).length ===
                    0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Mail className="text-muted-foreground/30 size-12 mb-4" />
                        <p className="text-muted-foreground text-sm">
                          No archived notifications
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredNotifications
                          .filter((n) => n.isRead)
                          .map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleSelect(notification.id)}
                              className={cn(
                                "hover:bg-accent/50 w-full p-4 text-left transition-colors",
                                selectedId === notification.id && "bg-accent",
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={cn(
                                    "mt-1 size-2 rounded-full",
                                    getTypeColor(notification.type),
                                  )}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-sm font-medium">
                                      {notification.title}
                                    </p>
                                    <span className="text-muted-foreground shrink-0 text-xs">
                                      {formatRelativeTime(
                                        notification.createdAt,
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Detail View */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="flex h-full flex-col">
              {selectedNotification ? (
                <div className="flex h-full flex-col">
                  <div className="border-b p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "size-2 rounded-full",
                              getTypeColor(selectedNotification.type),
                            )}
                          />
                          <h1 className="text-2xl font-semibold">
                            {selectedNotification.title}
                          </h1>
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm">
                          {formatRelativeTime(selectedNotification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground whitespace-pre-wrap">
                        {selectedNotification.message}
                      </p>
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <Mail className="text-muted-foreground/30 size-16 mb-4" />
                  <h3 className="text-lg font-semibold">
                    No notification selected
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Select a notification from the list to view its details
                  </p>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </HeaderPage>
  );
}
