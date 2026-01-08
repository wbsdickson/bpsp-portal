"use client";

import React from "react";
import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  ArrowRight,
  ChevronRight,
  Laptop,
  Moon,
  Sun,
  ExternalLink,
  Languages,
  Check,
} from "lucide-react";
import { useSearch } from "@/context/search-provider";
import { useTheme } from "next-themes";
import { setUserLocale } from "@/actions/set-locale";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { AppUser } from "@/types/user";

// Extract routes from sidebar structure for operator
function getOperatorRoutes(
  t: ReturnType<typeof useTranslations>,
  tCommand: ReturnType<typeof useTranslations<"Operator.CommandMenu">>,
) {
  const mainRoutes = [
    { key: "dashboard", route: "operator/dashboard" },
    { key: "accounts", route: "operator/accounts" },
    { key: "merchantsManagement", route: "operator/merchant-management" },
    { key: "merchants", route: "operator/merchants" },
    { key: "payoutTransactions", route: "operator/payout-transactions" },
    { key: "notifications", route: "operator/notifications" },
    { key: "sales", route: "operator/sales" },
    { key: "systemSettings", route: "operator/system-settings" },
    { key: "midSettings", route: "operator/mid-setting" },
    { key: "midFee", route: "operator/mid-fee" },
  ];

  const merchantManagementRoutes = [
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
    { key: "receiptIssuance", route: "operator/merchant-management/receipts" },
    {
      key: "receivedPayableInvoices",
      route: "operator/merchant-management/received-payable-invoices",
    },
  ];

  return [
    {
      title: tCommand("navigation"),
      items: mainRoutes.map((route) => {
        if (route.key === "merchantsManagement") {
          return {
            title: t(`Operator.Sidebar.${route.key}`),
            items: merchantManagementRoutes.map((subRoute) => ({
              title: t(`Operator.Sidebar.merchantManagement.${subRoute.key}`),
              url: `/${subRoute.route}`,
            })),
          };
        }
        return {
          title: t(`Operator.Sidebar.${route.key}`),
          url: `/${route.route}`,
        };
      }),
    },
  ];
}

// Extract routes from sidebar structure for merchant
function getMerchantRoutes(
  t: ReturnType<typeof useTranslations>,
  tCommand: ReturnType<typeof useTranslations<"Merchant.CommandMenu">>,
) {
  const merchantRoutes = [
    { key: "dashboard", route: "merchant/dashboard" },
    { key: "accountInformationManagement", route: "merchant/account" },
    { key: "companyInformationManagement", route: "merchant/company" },
    { key: "memberManagement", route: "merchant/member" },
    { key: "clientManagement", route: "merchant/client" },
    { key: "merchantBankAccount", route: "merchant/bank-accounts" },
    { key: "merchantCards", route: "merchant/cards" },
    { key: "taxSettings", route: "merchant/tax-settings" },
    { key: "items", route: "merchant/items" },
    {
      key: "documentOutputSettings",
      route: "merchant/document-output-settings",
    },
    { key: "invoiceManagement", route: "merchant/invoice-management" },
    { key: "invoiceAutoIssuance", route: "merchant/invoice-auto-issuance" },
    { key: "quotationIssuance", route: "merchant/quotations" },
    { key: "purchaseOrders", route: "merchant/purchase-orders" },
    { key: "deliveryNotesIssuance", route: "merchant/delivery-notes" },
    { key: "receiptIssuance", route: "merchant/receipt" },
    {
      key: "receivedPayableInvoices",
      route: "merchant/received-payable-invoices",
    },
  ];

  return [
    {
      title: tCommand("navigation"),
      items: merchantRoutes.map((route) => ({
        title: t(`Merchant.Sidebar.${route.key}`),
        url: `/${route.route}`,
      })),
    },
  ];
}

export function CommandMenu() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();
  const { data: session } = useSession();
  const currentUser = session?.user as AppUser | undefined;
  const userRole = currentUser?.role;
  const t = useTranslations();
  const merchantTCommand = useTranslations("Merchant.CommandMenu");
  const operatorTCommand = useTranslations("Operator.CommandMenu");
  const tCommand =
    userRole === "merchant" ? merchantTCommand : operatorTCommand;
  const [isPending, startTransition] = useTransition();

  const sidebarData = React.useMemo(() => {
    if (userRole === "merchant") {
      return getMerchantRoutes(t, merchantTCommand);
    }
    // For admin and other roles, show operator routes
    return getOperatorRoutes(t, operatorTCommand);
  }, [t, merchantTCommand, operatorTCommand, userRole]);
  const [selectedUrl, setSelectedUrl] = React.useState<string | null>(null);

  const localeOptions = [
    { value: "en", label: "English" },
    { value: "ja", label: "Japanese" },
  ] as const;

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  const navigateTo = (url: string) => {
    const localeUrl = url.startsWith(`/${locale}`) ? url : `/${locale}${url}`;
    router.push(localeUrl);
  };

  const handleItemSelect = (url: string) => {
    setSelectedUrl(url);
    runCommand(() => navigateTo(url));
  };

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    runCommand(() => {
      startTransition(async () => {
        await setUserLocale(newLocale);
        router.refresh();
      });
    });
  };

  return (
    <CommandDialog
      modal
      open={open}
      onOpenChange={setOpen}
      showCloseButton={false}
    >
      <CommandInput placeholder={tCommand("placeholder")} />
      <CommandList>
        <CommandEmpty>{tCommand("noResults")}</CommandEmpty>
        {sidebarData.map((group) => (
          <CommandGroup key={group.title} heading={group.title}>
            {group.items.map((navItem, i) => {
              if ("url" in navItem && navItem.url) {
                const isActive =
                  pathname === `/${locale}${navItem.url}` ||
                  pathname === navItem.url;
                return (
                  <CommandItem
                    key={`${navItem.url}-${i}`}
                    value={navItem.title}
                    onSelect={() => {
                      handleItemSelect(navItem.url!);
                    }}
                    className={isActive ? "bg-muted" : ""}
                  >
                    <ArrowRight className="text-muted-foreground/80" />
                    {navItem.title}
                  </CommandItem>
                );
              }

              if ("items" in navItem && navItem.items) {
                return navItem.items.map(
                  (subItem: { title: string; url: string }, j: number) => {
                    const isActive =
                      pathname === `/${locale}${subItem.url}` ||
                      pathname === subItem.url;
                    return (
                      <CommandItem
                        key={`${navItem.title}-${subItem.url}-${j}`}
                        value={`${navItem.title}-${subItem.url}`}
                        onSelect={() => {
                          handleItemSelect(subItem.url);
                        }}
                        className={isActive ? "bg-muted" : ""}
                      >
                        <ArrowRight className="text-muted-foreground/80" />
                        {
                          navItem.title
                        } <ChevronRight className="size-3.5" /> {subItem.title}
                      </CommandItem>
                    );
                  },
                );
              }

              return null;
            })}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading={tCommand("locale")}>
          {localeOptions.map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => handleLocaleChange(option.value)}
              disabled={isPending || option.value === locale}
            >
              <Languages className="size-3.5" />
              <span className="flex-1">{option.label}</span>
              {option.value === locale && <Check className="size-3.5" />}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={tCommand("theme")}>
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="size-3.5" /> <span>Light</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="size-3.5 scale-90" />
            <span>Dark</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="size-3.5" />
            <span>System</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
