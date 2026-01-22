"use client";

import * as React from "react";
import {
  LayoutDashboard,
  User,
  Building2,
  Users,
  UserCircle,
  Wallet,
  CreditCard,
  ShoppingBag,
  Receipt,
  File,
  FileText,
  FileCheck,
  Zap,
  Quote,
  ShoppingCart,
  Truck,
  StickyNote,
  type LucideIcon,
  Bell,
  Settings,
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
import { SidebarLastUpdate } from "@/components/sidebar-last-update";
import { useSession } from "next-auth/react";
import { useUserPreferencesStore } from "@/store/user-preferences-store";
import { useTranslations } from "next-intl";
import { AppSideBarHeader } from "../../_components/app-side-bar-header";
import { AppSideBarFooter } from "../../_components/app-side-bar-footer";

type NavRoute = {
  label: string;
  route: string;
  icon?: LucideIcon;
  children?: NavRoute[];
};

const ISSUANCE_ROUTES = [
  { key: "invoiceManagement", route: "merchant/invoice-management" },
  { key: "invoiceAutoIssuance", route: "merchant/invoice-auto-issuance" },
  { key: "quotationIssuance", route: "merchant/quotations" },
  { key: "deliveryNotesIssuance", route: "merchant/delivery-notes" },
  { key: "receiptIssuance", route: "merchant/receipt" },
  { key: "rpInvoicesAutoIssuance", route: "merchant/rp-invoice-auto-issuance" },
] as const;

const RECEIPT_PAYMENT_ROUTES = [
  {
    key: "receivedPayableInvoices",
    route: "merchant/received-payable-invoices",
  },
  { key: "purchaseOrders", route: "merchant/purchase-orders" },
  { key: "creditPayment", route: "merchant/credit-payment" },
] as const;

const SETTINGS_ROUTES = [
  {
    key: "companyInformationManagement",
    route: "merchant/company-information",
  },
  { key: "memberManagement", route: "merchant/members" },
  { key: "clientManagement", route: "merchant/clients" },
  { key: "merchantBankAccount", route: "merchant/bank-accounts" },
  { key: "merchantCards", route: "merchant/cards" },
  { key: "taxSettings", route: "merchant/tax-settings" },
  { key: "documentOutputSettings", route: "merchant/document-output-settings" },
  { key: "items", route: "merchant/items" },
  { key: "notifications", route: "merchant/notifications" },
] as const;

const MAIN_ROUTES = [
  { key: "dashboard", route: "merchant/dashboard", icon: LayoutDashboard },
  {
    key: "issuance",
    route: "#",
    icon: FileText,
  },
  {
    key: "receiptPayment",
    route: "#",
    icon: Wallet,
  },
  {
    key: "settings",
    route: "#",
    icon: Settings,
  },
] as const;

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { role?: string }) {
  const t = useTranslations("Merchant.Sidebar");
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
        if (key === "issuance") {
          return {
            label: t(key),
            route,
            icon,
            children: ISSUANCE_ROUTES.map(
              ({ key: childKey, route: childRoute }) => ({
                label: t(`${childKey}` as any),
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
              ({ key: childKey, route: childRoute }) => ({
                label: t(`${childKey}` as any),
                route: childRoute,
              }),
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
                label: t(childKey as any),
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
        <NavMain routes={routes} />
      </SidebarContent>
      <AppSideBarFooter t={t} />
      <SidebarRail />
    </Sidebar>
  );
}
