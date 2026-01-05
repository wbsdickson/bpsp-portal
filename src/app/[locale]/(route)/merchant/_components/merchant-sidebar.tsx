"use client";

import * as React from "react";
import {
  CreditCard,
  FileText,
  Grid2X2,
  HelpCircle,
  Link2,
  Bell,
  Settings,
  Plus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";

const merchantRoutes = [
  {
    label: "Dashboard",
    route: "merchant/dashboard",
  },
  {
    label: "Account Information Management",
    route: "merchant/account",
  },
  {
    label: "Company Information Management",
    route: "merchant/company",
  },
  {
    label: "Member Management",
    route: "merchant/member",
  },
  {
    label: "Client Management",
    route: "merchant/client",
  },
  {
    label: "Merchant Bank Account",
    route: "merchant/bank-accounts",
  },
  {
    label: "Merchant Cards",
    route: "merchant/cards",
  },
  {
    label: "Tax Settings",
    route: "merchant/tax-settings",
  },
  {
    label: "Items",
    route: "merchant/items",
  },
];

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { role?: string }) {
  const routes = merchantRoutes;
  const session = useSession();
  const user = session?.data?.user;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher name={user?.name ?? ""} company={user?.email ?? ""} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain routes={routes} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-1 px-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Grid2X2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Apps
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <HelpCircle className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Help
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Bell className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Notifications
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Settings className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Settings
            </TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Plus className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className="w-56 rounded-xl p-2"
            >
              <DropdownMenuItem className="gap-3 py-2">
                <FileText className="size-4" />
                <span>Invoice</span>
                <DropdownMenuShortcut className="tracking-normal">
                  C I
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2">
                <CreditCard className="size-4" />
                <span>Subscription</span>
                <DropdownMenuShortcut className="tracking-normal">
                  C S
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2">
                <Link2 className="size-4" />
                <span>Payment link</span>
                <DropdownMenuShortcut className="tracking-normal">
                  C L
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2">
                <CreditCard className="size-4" />
                <span>Payment</span>
                <DropdownMenuShortcut className="tracking-normal">
                  C P
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
