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
import { useTranslations } from "next-intl";

type NavRoute = {
  label: string;
  route: string;
  children?: NavRoute[];
};
// {
//   label: "Payment",
//   route: "payment",
//   children: [
//     {
//       label: "Transactions",
//       route: "transactions",
//     },
//     {
//       label: "Chargebacks",
//       route: "chargeback",
//     },
//     {
//       label: "Checkout Sessions",
//       route: "checkout-sessions",
//     },
//     {
//       label: "Payment Links",
//       route: "payment-links",
//     },
//     {
//       label: "Payment Methods",
//       route: "payment-methods",
//     },
//     {
//       label: "Subscriptions",
//       route: "subscriptions",
//     },
//     {
//       label: "Webhooks",
//       route: "webhooks",
//     },
//   ],
// },
// {
//   label: "Gateway Management",
//   route: "gateway-management",
//   children: [
//     {
//       label: "Routing",
//       route: "routing",
//     },
//     {
//       label: "Mid",
//       route: "mid",
//     },
//     {
//       label: "Fee",
//       route: "fee",
//     },
//     {
//       label: "Blocked Card",
//       route: "blocked-card",
//     },
//   ],
// },

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { role?: string }) {
  const t = useTranslations("Operator.Sidebar");
  const routes = React.useMemo<NavRoute[]>(
    () => [
      {
        label: t("dashboard"),
        route: "operator/dashboard",
      },
      {
        label: t("accounts"),
        route: "operator/accounts",
      },
      {
        label: t("merchantsManagement"),
        route: "operator/merchant-management",
        children: [
          {
            label: t("merchantManagement.dashboard"),
            route: "operator/merchant-management/dashboard",
          },
          {
            label: t("merchantManagement.member"),
            route: "operator/merchant-management/members",
          },
          {
            label: t("merchantManagement.midSettings"),
            route: "operator/merchant-management/mid-settings",
          },
          {
            label: t("merchantManagement.feeRate"),
            route: "operator/merchant-management/fee-rate",
          },
          {
            label: t("merchantManagement.transaction"),
            route: "operator/merchant-management/transactions",
          },
          {
            label: t("merchantManagement.client"),
            route: "operator/merchant-management/clients",
          },
          {
            label: t("merchantManagement.bankAccount"),
            route: "operator/merchant-management/bank-accounts",
          },
          {
            label: t("merchantManagement.cards"),
            route: "operator/merchant-management/cards",
          },
          {
            label: t("merchantManagement.taxSettings"),
            route: "operator/merchant-management/tax-settings",
          },
          {
            label: t("merchantManagement.items"),
            route: "operator/merchant-management/items",
          },
          {
            label: t("merchantManagement.invoicesIssuance"),
            route: "operator/merchant-management/invoices",
          },
          {
            label: t("merchantManagement.quotationsIssuance"),
            route: "operator/merchant-management/quotations",
          },
          {
            label: t("merchantManagement.deliveryNoteIssuance"),
            route: "operator/merchant-management/delivery-notes",
          },
          {
            label: t("merchantManagement.receiptIssuance"),
            route: "operator/merchant-management/receipt",
          },
          {
            label: t("merchantManagement.receivedPayableInvoices"),
            route: "operator/merchant-management/received-payable-invoices",
          },
        ],
      },
      {
        label: t("merchants"),
        route: "operator/merchants",
      },
      {
        label: t("payoutTransactions"),
        route: "operator/payout-transactions",
      },
      {
        label: t("notifications"),
        route: "operator/notifications",
      },
      {
        label: t("sales"),
        route: "operator/sales",
      },
      {
        label: t("systemSettings"),
        route: "operator/system-settings",
      },
      {
        label: t("midSettings"),
        route: "operator/mid",
      },
      {
        label: t("midFee"),
        route: "operator/mid-fee",
      },
    ],
    [t],
  );
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
