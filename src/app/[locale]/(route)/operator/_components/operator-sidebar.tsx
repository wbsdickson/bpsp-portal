"use client";

import * as React from "react";
import {
  FileText,
  Grid2X2,
  Settings,
  Plus,
  Receipt,
  ScrollText,
  User,
  Store,
  type LucideIcon,
} from "lucide-react";

import { HelpPopover } from "./help-popover";
import { NotificationPopover } from "./notification-popover";

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
import { Link } from "next-view-transitions";

type NavRoute = {
  label: string;
  route: string;
  children?: NavRoute[];
};

type FooterButton = {
  icon: LucideIcon;
  tooltipKey: string;
  url: string;
};

type QuickActionItem = {
  icon: LucideIcon;
  labelKey: string;
  shortcut: string;
  url: string;
};

const FOOTER_BUTTONS: FooterButton[] = [
  {
    icon: Settings,
    tooltipKey: "footer.settings",
    url: "/operator/system-settings",
  },
];

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    icon: FileText,
    labelKey: "quickActions.invoice",
    shortcut: "C I",
    url: "/operator/merchant-management/invoices/create",
  },
  {
    icon: Receipt,
    labelKey: "quickActions.receipt",
    shortcut: "C S",
    url: "/operator/merchant-management/receipt/create",
  },
  {
    icon: ScrollText,
    labelKey: "quickActions.quotation",
    shortcut: "C S",
    url: "/operator/merchant-management/quotations/create",
  },
  {
    icon: User,
    labelKey: "quickActions.client",
    shortcut: "C S",
    url: "/operator/merchant-management/clients/create",
  },
  {
    icon: Store,
    labelKey: "quickActions.merchant",
    shortcut: "C L",
    url: "/operator/merchants/create",
  },
];

const MERCHANT_MANAGEMENT_ROUTES = [
  { key: "dashboard", route: "operator/merchant-management/dashboard" },
  { key: "member", route: "operator/merchant-management/members" },
  { key: "midSettings", route: "operator/merchant-management/mid-settings" },
  { key: "feeRate", route: "operator/merchant-management/fee-rate" },
  { key: "transaction", route: "operator/merchant-management/transactions" },
  { key: "client", route: "operator/merchant-management/clients" },
  { key: "bankAccount", route: "operator/merchant-management/bank-accounts" },
  { key: "cards", route: "operator/merchant-management/cards" },
  { key: "taxSettings", route: "operator/merchant-management/tax-settings" },
  { key: "items", route: "operator/merchant-management/items" },
  { key: "invoicesIssuance", route: "operator/merchant-management/invoices" },
  {
    key: "quotationsIssuance",
    route: "operator/merchant-management/quotations",
  },
  {
    key: "deliveryNoteIssuance",
    route: "operator/merchant-management/delivery-notes",
  },
  { key: "receiptIssuance", route: "operator/merchant-management/receipt" },
  {
    key: "receivedPayableInvoices",
    route: "operator/merchant-management/received-payable-invoices",
  },
] as const;

const MAIN_ROUTES = [
  { key: "dashboard", route: "operator/dashboard" },
  { key: "accounts", route: "operator/accounts" },
  { key: "merchantsManagement", route: "operator/merchant-management" },
  { key: "merchants", route: "operator/merchants" },
  { key: "payoutTransactions", route: "operator/payout-transactions" },
  { key: "notifications", route: "operator/notifications" },
  { key: "sales", route: "operator/sales" },
  { key: "systemSettings", route: "operator/system-settings" },
  { key: "midSettings", route: "operator/mid" },
  { key: "midFee", route: "operator/mid-fee" },
] as const;

function FooterButton({
  icon: Icon,
  tooltip,
  url,
}: {
  icon: LucideIcon;
  tooltip: string;
  url: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link href={url}>
            <Icon className="size-4" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Operator.Sidebar");
  const session = useSession();

  const user = React.useMemo(
    () => ({
      name: session?.data?.user?.name ?? "",
      email: session?.data?.user?.email ?? "",
    }),
    [session?.data?.user?.name, session?.data?.user?.email],
  );

  const routes = React.useMemo<NavRoute[]>(
    () => [
      ...MAIN_ROUTES.map(({ key, route }) => {
        if (key === "merchantsManagement") {
          return {
            label: t(key),
            route,
            children: MERCHANT_MANAGEMENT_ROUTES.map(
              ({ key: childKey, route: childRoute }) => ({
                label: t(`merchantManagement.${childKey}`),
                route: childRoute,
              }),
            ),
          };
        }
        return {
          label: t(key),
          route,
        };
      }),
    ],
    [t],
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher name={user.name} company={user.email} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain routes={routes} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-1 px-1">
          <HelpPopover />
          <NotificationPopover />
          {FOOTER_BUTTONS.map((button) => (
            <FooterButton
              key={button.tooltipKey}
              {...button}
              tooltip={t(button.tooltipKey)}
            />
          ))}
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
              {QUICK_ACTIONS.map((action) => (
                <DropdownMenuItem
                  key={action.labelKey}
                  className="gap-3 py-2"
                  asChild
                >
                  <Link href={action.url}>
                    <action.icon className="size-4" />
                    <span>{t(action.labelKey)}</span>
                    <DropdownMenuShortcut className="tracking-normal">
                      {action.shortcut}
                    </DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
