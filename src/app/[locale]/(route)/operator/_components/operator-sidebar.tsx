"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  CreditCard,
  Bell,
  TrendingUp,
  Settings,
  Wallet,
  Receipt,
  FileText,
  type LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import { useUserPreferencesStore } from "@/store/user-preferences-store";
import { AppSideBarHeader } from "../../_components/app-side-bar-header";
import { AppSideBarFooter } from "../../_components/app-side-bar-footer";
import { Separator } from "@/components/ui/separator";
import Home from "@/components/icons/home";
import FilePlus from "@/components/icons/file-plus";
import BankNote from "@/components/icons/bank-note";

type NavRoute = {
  label: string;
  route: string;
  icon?: LucideIcon;
  children?: NavRoute[];
};

const ISSUANCE_ROUTES = [
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
] as const;

const RECEIPT_PAYMENT_ROUTES = [
  {
    key: "receivedPayableInvoices",
    route: "operator/merchant-management/received-payable-invoices",
  },
  { key: "transaction", route: "operator/merchant-management/transactions" },
] as const;

const SETTINGS_ROUTES = [
  {
    key: "midSettings",
    route: "operator/merchant-management/mid-settings",
  }, // Placeholder mapping
  { key: "clients", route: "operator/merchant-management/clients" },
  {
    key: "taxSettings",
    route: "operator/merchant-management/tax-settings",
  }, // Placeholder mapping
  { key: "feeRate", route: "operator/merchant-management/fee-rate" }, // Placeholder mapping
  { key: "member", route: "operator/merchant-management/members" },
  { key: "items", route: "operator/merchant-management/items" },
  {
    key: "bankAccount",
    route: "operator/merchant-management/bank-accounts",
  },
] as const;

const TOP_LEVEL_ROUTES = [
  { key: "dashboard", route: "operator/dashboard", icon: LayoutDashboard },
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

const MERCHANT_GROUP_ROUTES = [
  {
    key: "dashboard",
    route: "operator/merchant-management/dashboard",
    icon: Home as any,
  },
  {
    key: "issuance",
    route: "#",
    icon: FilePlus as any,
  },
  {
    key: "receiptPayment",
    route: "#",
    icon: BankNote as any,
  },
  {
    key: "settings",
    route: "#",
    icon: Settings,
  },
] as const;

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Operator.Sidebar");
  const { preferences } = useUserPreferencesStore();

  const topRoutes = React.useMemo<NavRoute[]>(
    () => [
      ...TOP_LEVEL_ROUTES.map(({ key, route, icon }) => ({
        label: t(key),
        route,
        icon,
      })),
    ],
    [t],
  );

  const merchantRoutes = React.useMemo<NavRoute[]>(
    () => [
      ...MERCHANT_GROUP_ROUTES.map(({ key, route, icon }) => {
        if (key === "issuance") {
          return {
            label: t(key),
            route,
            icon,
            children: ISSUANCE_ROUTES.map(
              ({ key: childKey, route: childRoute }) => ({
                label: t(`merchantManagement.${childKey}`),
                route: childRoute,
              }),
            ),
          };
        }
        if (key === "receiptPayment") {
          return {
            label: t(key),
            route,
            icon,
            children: RECEIPT_PAYMENT_ROUTES.map(
              ({ key: childKey, route: childRoute }) => {
                let labelKey = `merchantManagement.${childKey}`;
                return {
                  label: t(labelKey),
                  route: childRoute,
                };
              },
            ),
          };
        }
        if (key === "settings") {
          return {
            label: t(key),
            route,
            icon,
            children: SETTINGS_ROUTES.map(
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

  return (
    <Sidebar
      collapsible="icon"
      variant={preferences.sidebarVariant}
      {...props}
      className="p-0"
    >
      <AppSideBarHeader />
      <SidebarContent>
        <NavMain routes={topRoutes} />
        <NavMain routes={merchantRoutes} title={t("merchantSection")} />
      </SidebarContent>
      <Separator />
      <AppSideBarFooter t={t} />
      <SidebarRail />
    </Sidebar>
  );
}
