"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

type NavRoute = {
  label: string;
  route: string;
  children?: NavRoute[];
};

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
      <SidebarRail />
    </Sidebar>
  );
}
