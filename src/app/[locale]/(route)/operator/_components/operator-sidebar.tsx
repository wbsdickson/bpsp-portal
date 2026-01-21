"use client";

import * as React from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Building2,
  Store,
  CreditCard,
  Bell,
  TrendingUp,
  Settings,
  Wallet,
  Receipt,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Home,
  FileText,
  LogOut,
  type LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SidebarLastUpdate } from "@/components/sidebar-last-update";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useUserPreferencesStore } from "@/store/user-preferences-store";
import { AppSideBarHeader } from "../../_components/app-side-bar-header";
import { AppSideBarFooter } from "../../_components/app-side-bar-footer";

type NavRoute = {
  label: string;
  route: string;
  icon?: LucideIcon;
  children?: NavRoute[];
};

const MERCHANT_MANAGEMENT_ROUTES = [
  { key: "dashboard", route: "operator/merchant-management/dashboard" },
  { key: "member", route: "operator/merchant-management/members" },
  { key: "client", route: "operator/merchant-management/clients" },
  { key: "transaction", route: "operator/merchant-management/transactions" },
  { key: "bankAccount", route: "operator/merchant-management/bank-accounts" },
  { key: "cards", route: "operator/merchant-management/cards" },
  { key: "midSettings", route: "operator/merchant-management/mid-settings" },
  { key: "feeRate", route: "operator/merchant-management/fee-rate" },
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
  { key: "receiptIssuance", route: "operator/merchant-management/receipts" },
  {
    key: "receivedPayableInvoices",
    route: "operator/merchant-management/received-payable-invoices",
  },
] as const;

const MAIN_ROUTES = [
  { key: "dashboard", route: "operator/dashboard", icon: LayoutDashboard },
  {
    key: "merchantsManagement",
    route: "operator/merchant-management",
    icon: Building2,
  },
  { key: "merchants", route: "operator/merchants", icon: Store },
  { key: "accounts", route: "operator/accounts", icon: Users },
  { key: "sales", route: "operator/sales", icon: TrendingUp },
  {
    key: "payoutTransactions",
    route: "operator/payout-transactions",
    icon: CreditCard,
  },
  { key: "notifications", route: "operator/notifications", icon: Bell },
  { key: "midSettings", route: "operator/mid-setting", icon: Wallet },
  { key: "midFee", route: "operator/mid-fee", icon: Receipt },
  { key: "systemSettings", route: "operator/system-settings", icon: Settings },
] as const;

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Operator.Sidebar");
  const session = useSession();
  const { preferences } = useUserPreferencesStore();

  const user = React.useMemo(
    () => ({
      name: session?.data?.user?.name ?? "",
      email: session?.data?.user?.email ?? "",
      role: (session?.data?.user as any)?.role ?? "",
      companyName: (session?.data?.user as any)?.companyName ?? "",
    }),
    [
      session?.data?.user?.name,
      session?.data?.user?.email,
      (session?.data?.user as any)?.role,
    ],
  );

  const routes = React.useMemo<NavRoute[]>(
    () => [
      ...MAIN_ROUTES.map(({ key, route, icon }) => {
        if (key === "merchantsManagement") {
          return {
            label: t(key),
            route,
            icon,
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
          icon,
        };
      }),
    ],
    [t],
  );

  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    signOut({ callbackUrl: `/signin` });
  };

  return (
    <Sidebar
      collapsible="icon"
      variant={preferences.sidebarVariant}
      {...props}
      className="p-0"
    >
      <AppSideBarHeader />
      <SidebarContent>
        <NavMain routes={routes} />
      </SidebarContent>
      <AppSideBarFooter t={t} />
      <SidebarRail />
    </Sidebar>
  );
}
