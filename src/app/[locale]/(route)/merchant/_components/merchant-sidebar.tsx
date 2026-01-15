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

type NavRoute = {
  label: string;
  route: string;
  icon?: LucideIcon;
  children?: NavRoute[];
};

const merchantRoutes: NavRoute[] = [
  // Top section
  {
    label: "dashboard",
    route: "merchant/dashboard",
    icon: LayoutDashboard,
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
    label: "creditPayment",
    route: "merchant/credit-payment",
    icon: CreditCard,
  },
  // Settings group

  {
    label: "companyInformationManagement",
    route: "merchant/company-information",
    icon: Building2,
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
    label: "documentOutputSettings",
    route: "merchant/document-output-settings",
    icon: File,
  },
  {
    label: "notifications",
    route: "merchant/notifications",
    icon: Bell,
  },
  {
    label: "purchaseOrders",
    route: "merchant/purchase-orders",
    icon: ShoppingCart,
  },
  {
    label: "items",
    route: "merchant/items",
    icon: ShoppingBag,
  },
  {
    label: "invoiceManagement",
    route: "merchant/invoice-management",
    icon: FileText,
  },
  // Issuance group
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
    label: "rpInvoicesAutoIssuance",
    route: "merchant/rp-invoice-auto-issuance",
    icon: Zap,
  },
  // Other management items
  {
    label: "receivedPayableInvoices",
    route: "merchant/received-payable-invoices",
    icon: FileCheck,
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
      role: session?.data?.user?.role ?? "",
      companyName: (session?.data?.user as any)?.companyName ?? "",
    }),
    [session?.data?.user?.name, session?.data?.user?.email, session?.data?.user?.role],
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
        <TeamSwitcher name={user?.name ?? ""} role={user?.role ?? ""} email={user?.email ?? ""} companyName={user?.companyName ?? ""} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain routes={routes} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarLastUpdate />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
