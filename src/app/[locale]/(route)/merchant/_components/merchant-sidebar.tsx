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
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { useUserPreferencesStore } from "@/store/user-preferences-store";
import { useTranslations } from "next-intl";

type NavRoute = {
  label: string;
  route: string;
  icon?: LucideIcon;
  children?: NavRoute[];
};

const merchantRoutes: NavRoute[] = [
  {
    label: "dashboard",
    route: "merchant/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "accountInformationManagement",
    route: "merchant/account-information",
    icon: User,
  },
  {
    label: "companyInformationManagement",
    route: "merchant/company-information",
    icon: Building2,
  },
  {
    label: "memberManagement",
    route: "merchant/members",
    icon: Users,
  },
  {
    label: "clientManagement",
    route: "merchant/clients",
    icon: UserCircle,
  },
  {
    label: "merchantBankAccount",
    route: "merchant/bank-accounts",
    icon: Wallet,
  },
  {
    label: "merchantCards",
    route: "merchant/cards",
    icon: CreditCard,
  },
  {
    label: "taxSettings",
    route: "merchant/tax-settings",
    icon: Receipt,
  },
  {
    label: "items",
    route: "merchant/items",
    icon: ShoppingBag,
  },
  {
    label: "documentOutputSettings",
    route: "merchant/document-output-settings",
    icon: File,
  },
  {
    label: "invoiceManagement",
    route: "merchant/invoice-management",
    icon: FileText,
  },
  {
    label: "invoiceAutoIssuance",
    route: "merchant/invoice-auto-issuance",
    icon: Zap,
  },
  {
    label: "quotationIssuance",
    route: "merchant/quotations",
    icon: Quote,
  },
  {
    label: "purchaseOrders",
    route: "merchant/purchase-orders",
    icon: ShoppingCart,
  },
  {
    label: "deliveryNotesIssuance",
    route: "merchant/delivery-notes",
    icon: Truck,
  },
  {
    label: "receiptIssuance",
    route: "merchant/receipt",
    icon: StickyNote,
  },
  {
    label: "receivedPayableInvoices",
    route: "merchant/received-payable-invoices",
    icon: FileCheck,
  },
  {
    label: "rpInvoicesAutoIssuance",
    route: "merchant/rp-invoice-auto-issuance",
    icon: Zap,
  },
  {
    label: "notifications",
    route: "merchant/notifications",
    icon: Bell,
  },
  {
    label: "registration",
    route: "merchant/registration",
    icon: User,
  },
  {
    label: "creditPayment",
    route: "merchant/credit-payment",
    icon: CreditCard,
  },
];

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
    }),
    [session?.data?.user?.name, session?.data?.user?.email],
  );

  const routes = React.useMemo<NavRoute[]>(
    () =>
      merchantRoutes.map(({ label, route, icon }) => {
        return {
          label: t(label),
          route,
          icon,
        };
      }),
    [t],
  );

  return (
    <Sidebar collapsible="icon" variant={preferences.sidebarVariant} {...props}>
      <SidebarHeader>
        <TeamSwitcher name={user?.name ?? ""} company={user?.email ?? ""} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain routes={routes} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
