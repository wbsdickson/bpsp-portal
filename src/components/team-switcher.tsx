"use client";

import * as React from "react";
import { AudioWaveform, ChevronsUpDown, LogOut, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
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

  const handleLogout = () => {
    signOut({ callbackUrl: `/${locale}/signin` });
  };

  const actions = [
    {
      label: "Profle",
      onClick: () => {},
    },
    {
      label: "Change Password",
      onClick: () => {},
    },
    {
      label: "Notice settings",
      onClick: () => {},
    },
    {
      label: "Notification",
      onClick: () => {},
    },
    {
      label: "FAQ",
      onClick: () => {},
    },
    {
      label: "Logout",
      onClick: handleLogout,
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
            className="w-(--radix-dropdown-menu-trigger-width) min-w-65 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              <LocaleSwitcherHorizontal />
            </DropdownMenuLabel>

            {actions.map((action, index) => (
              <DropdownMenuItem
                key={action.label}
                onClick={action.onClick}
                className="gap-2 p-2"
              >
                {/* <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div> */}
                {action.label}
                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem
              className="h-10 hover:cursor-pointer"
              onClick={handleLogout}
            >
              Logout
              <DropdownMenuShortcut>
                <LogOut size={14} />
              </DropdownMenuShortcut>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
