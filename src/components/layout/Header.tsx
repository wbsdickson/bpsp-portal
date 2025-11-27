"use client";

import { useAppStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Bell, ShieldAlert, Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { logoutUser } from "@/app/logout/actions";
import { toast } from "sonner";
import { format } from "date-fns";

export function Header() {
  const router = useRouter();
  const { currentUser, logout, originalAdmin, stopImpersonating, getMerchantNotifications } =
    useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!currentUser) return null;

  const notifications = getMerchantNotifications(currentUser.merchantId || '', currentUser.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

  const handleStopImpersonating = () => {
    stopImpersonating();
    router.push("/dashboard/admin/tenants");
  };

  // ...existing code...
  const handleLogout = async () => {
    if (currentUser) {
      await logoutUser(currentUser.id);
    }
    logout();
    toast.success("ログアウトしました");
    router.push("/login");
  };
  // ...existing code...


  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm md:ml-64 lg:ml-72">
      <div className="flex-1 flex items-center gap-4">
        <h2 className="text-lg font-semibold">
          Welcome back, {currentUser.name}
        </h2>
        {originalAdmin && (
          <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm border border-amber-200">
            <ShieldAlert className="h-4 w-4" />
            <span>Viewing as Merchant</span>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-amber-900 font-bold underline ml-1"
              onClick={handleStopImpersonating}
            >
              Exit View
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {mounted ? (
                theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Laptop className="h-5 w-5" />
                )
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px]"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs font-normal text-muted-foreground">
                  {unreadCount} unread
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentNotifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto">
                {recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                    onClick={() => router.push(`/dashboard/merchant/notifications/${notification.id}`)}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className={`font-medium text-sm ${!notification.isRead ? 'text-primary' : ''}`}>
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {format(new Date(notification.createdAt), 'MMM d, yyyy HH:mm')}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="w-full text-center justify-center text-primary font-medium cursor-pointer"
              onClick={() => router.push('/dashboard/merchant/notifications')}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full p-0"
            >
              <Image
                src="/JPCC/logo.png"
                alt="JPCC Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentUser.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
                <p className="text-xs font-semibold text-primary mt-1 capitalize">
                  {currentUser.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
