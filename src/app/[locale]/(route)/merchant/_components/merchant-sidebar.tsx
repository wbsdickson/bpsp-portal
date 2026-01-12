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

const merchantRoutes: Array<{
  label: string;
  route: string;
  icon?: LucideIcon;
}> = [
    {
      label: "Dashboard",
      route: "merchant/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Account Information",
      route: "merchant/account-information",
      icon: User,
    },
    {
      label: "Company Information",
      route: "merchant/company-information",
      icon: Building2,
    },
    {
      label: "Members",
      route: "merchant/members",
      icon: Users,
    },
    {
      label: "Clients",
      route: "merchant/clients",
      icon: UserCircle,
    },
    {
      label: "Bank Accounts",
      route: "merchant/bank-accounts",
      icon: Wallet,
    },
    {
      label: "Cards",
      route: "merchant/cards",
      icon: CreditCard,
    },
    {
      label: "Tax Settings",
      route: "merchant/tax-settings",
      icon: Receipt,
    },
    {
      label: "Items",
      route: "merchant/items",
      icon: ShoppingBag,
    },
    {
      label: "Document Output Settings",
      route: "merchant/document-output-settings",
      icon: File,
    },
    {
      label: "Invoice Management",
      route: "merchant/invoice-management",
      icon: FileText,
    },
    {
      label: "Invoice Auto-Issuance",
      route: "merchant/invoice-auto-issuance",
      icon: Zap,
    },
    {
      label: "Quotation Issuance",
      route: "merchant/quotations",
      icon: Quote,
    },
    {
      label: "Purchase Orders",
      route: "merchant/purchase-orders",
      icon: ShoppingCart,
    },
    {
      label: "Delivery Notes Issuance",
      route: "merchant/delivery-notes",
      icon: Truck,
    },
    {
      label: "Receipt Issuance",
      route: "merchant/receipt",
      icon: StickyNote,
    },
    {
      label: "Received Payable Invoices",
      route: "merchant/received-payable-invoices",
      icon: FileCheck,
    },
    {
      label: "RP Invoices Auto-Issuance",
      route: "merchant/rp-invoice-auto-issuance",
      icon: Zap,
    },
    {
      label: "Notifications",
      route: "merchant/notifications",
      icon: Bell,
    },
    {
      label: "Credit Payment",
      route: "merchant/credit-payment",
      icon: CreditCard,
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
      <SidebarRail />
    </Sidebar>
  );
}
