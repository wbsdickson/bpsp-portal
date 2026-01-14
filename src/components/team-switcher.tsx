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

export function TeamSwitcher({
  name,
  company,
}: {
  name: string;
  company: string;
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
    {
      label: t("notification"),
      icon: Bell,
      onClick: () => {},
    },
    {
      label: t("faq"),
      icon: HelpCircle,
      onClick: () => {},
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
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs">{company}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-65 rounded-xl bg-white p-2 shadow-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {/* Company Info */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
                <AudioWaveform className="size-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{company}</div>
              </div>
            </div>

            <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs">
              <LocaleSwitcherHorizontal />
            </DropdownMenuLabel>

            {actions.map((action, index) => (
              <DropdownMenuItem
                key={action.label}
                onClick={action.onClick}
                className="gap-3 rounded-sm px-2 py-2 text-sm hover:bg-gray-50"
              >
                <action.icon className="size-4" />
                {action.label}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleUserDetails}
              className="gap-3 rounded-sm px-2 py-2 text-sm hover:bg-gray-50"
            >
              <User className="size-4" />
              {t("userDetails")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="hover:bg-destructive/10! gap-3 rounded-sm px-2 py-2 text-sm"
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
