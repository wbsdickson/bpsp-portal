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

  const isMerchantPortal = pathname?.includes("/merchant");
  const accountInfoRoute = isMerchantPortal
    ? `/${locale}/merchant/account-information`
    : `/${locale}/operator/accounts`;

  const handleLogout = () => {
    signOut({ callbackUrl: `/${locale}/signin` });
  };

  const handleUserDetails = () => {
    router.push(accountInfoRoute);
  };

  const handleFAQ = () => {
    const faqRoute = isMerchantPortal
      ? `/${locale}/merchant/faq`
      : `/${locale}/operator/faq`;
    router.push(faqRoute);
  };

  const handleNotification = () => {
    const notificationsRoute = isMerchantPortal
      ? `/${locale}/merchant/notifications`
      : `/${locale}/operator/notifications`;
    router.push(notificationsRoute);
  };

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
            onClick: handleNotification,
          },
        ]
      : []),
    {
      label: t("faq"),
      icon: HelpCircle,
      onClick: handleFAQ,
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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground size-8 flex aspect-square items-center justify-center rounded-lg">
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

            {actions.map((action, index) => (
              <DropdownMenuItem
                key={action.label}
                onClick={action.onClick}
                className="hover:bg-accent gap-3 rounded-sm px-2 py-2 text-sm"
              >
                <action.icon className="size-4" />
                {action.label}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleUserDetails}
              className="hover:bg-accent gap-3 rounded-sm px-2 py-2 text-sm"
            >
              <User className="size-4" />
              {t("userDetails")}
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
