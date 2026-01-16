"use client";

import {
  AudioWaveform,
  ChevronsUpDown,
  User,
  Key,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherHorizontal from "./locale-switcher-horizontal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function TeamSwitcher({
  name,
  role,
  email,
  companyName,
}: {
  name: string;
  role?: string;
  email: string;
  companyName?: string;
}) {
  const { isMobile } = useSidebar();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("CommonComponent.TeamSwitcher");

  const isMerchantPortal =
    pathname?.startsWith(`/${locale}/merchant`) ||
    pathname?.startsWith("/merchant");

  const handleLogout = () => {
    signOut({ callbackUrl: `/${locale}/signin` });
  };

  // Removed handleUserDetails, handleFAQ, handleNotification handlers
  // Defined routes below for Link usage

  const userDetailRoute = isMerchantPortal
    ? `/${locale}/merchant/account-information`
    : `/${locale}/operator/user-details`;

  const notificationRoute = isMerchantPortal
    ? `/${locale}/merchant/notifications`
    : `/${locale}/operator/notifications`;

  const faqRoute = isMerchantPortal
    ? `/${locale}/merchant/faq`
    : `/${locale}/operator/faq`;

  const actions = [
    {
      label: t("changePassword"),
      icon: Key,
      onClick: () => {},
    },
    {
      label: t("noticeSettings"),
      icon: Settings,
      onClick: () => {},
    },
    ...(isMerchantPortal
      ? [
          {
            label: t("notification"),
            icon: Bell,
            href: notificationRoute,
          },
        ]
      : []),
    {
      label: t("faq"),
      icon: HelpCircle,
      href: faqRoute,
    },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <AudioWaveform className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">
                  {role === "admin" ? "Back Office" : "Merchant Company"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-65 bg-popover rounded-xl p-2 shadow-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="size-10 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-popover-foreground text-sm font-semibold">
                  {name}
                </div>
                {role && (
                  <div className="text-muted-foreground text-xs">{role}</div>
                )}
                <div className="text-muted-foreground text-xs">{email}</div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs">
              <LocaleSwitcherHorizontal />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {actions.map((action, index) => {
              if (action.href) {
                return (
                  <DropdownMenuItem
                    key={action.label}
                    asChild
                    className="hover:bg-accent gap-3 rounded-sm px-2 py-2 text-sm"
                  >
                    <Link href={action.href}>
                      <action.icon className="size-4" />
                      {action.label}
                    </Link>
                  </DropdownMenuItem>
                );
              }
              return (
                <DropdownMenuItem
                  key={action.label}
                  onClick={action.onClick}
                  className="hover:bg-accent gap-3 rounded-sm px-2 py-2 text-sm"
                >
                  <action.icon className="size-4" />
                  {action.label}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              asChild
              className="hover:bg-accent gap-3 rounded-sm px-2 py-2 text-sm"
            >
              <Link href={userDetailRoute}>
                <User className="size-4" />
                {t("userDetails")}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-3 rounded-sm px-2 py-2 text-sm"
            >
              <LogOut className="size-4" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
