"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  History,
  Users,
  Settings,
  LogOut,
  Menu,
  Globe,
  UserCog,
  Home,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const merchantLinks = [
  {
    name: "Dashboard / ダッシュボード",
    href: "/dashboard/merchant",
    icon: LayoutDashboard,
  },
  {
    name: "Invoices / 請求書",
    href: "/dashboard/merchant/invoices",
    icon: FileText,
  },
  {
    name: "Make Payment / 支払い",
    href: "/dashboard/merchant/payment",
    icon: CreditCard,
  },
  {
    name: "Payments / 履歴",
    href: "/dashboard/merchant/history",
    icon: History,
  },
];

const adminLinks = [
  {
    name: "Dashboard / ダッシュボード",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Payouts / 支払い管理",
    href: "/dashboard/admin/payouts",
    icon: CreditCard,
  },
  {
    name: "Tenants / テナント管理",
    href: "/dashboard/admin/tenants",
    icon: Users,
  },
  {
    name: "Settings / 設定",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

const jpccAdminLinks = [
  {
    name: "Payment Gateway / ペイメントゲートウェイ",
    icon: Globe,
    href: "#", // Parent item, no direct link
    subItems: [
      { name: "Dashboard", href: "/dashboard/jpcc/payment-gateway/dashboard" },
      {
        name: "Merchant Management",
        href: "/dashboard/jpcc/payment-gateway/merchant-management",
      },
      { name: "Payment", href: "/dashboard/jpcc/payment-gateway/payment" },
    ],
  },
  {
    name: "User Management / ユーザー管理",
    href: "/dashboard/jpcc/user-management",
    icon: UserCog,
  },
  {
    name: "Service Enablement / サービス有効化",
    href: "/dashboard/jpcc/service-enablement",
    icon: ShieldCheck,
  },
  {
    name: "RentEase",
    icon: Home,
    href: "#",
    subItems: [
      { name: "Dashboard", href: "/dashboard/jpcc/rentease/dashboard" },
      { name: "Members", href: "/dashboard/jpcc/rentease/members" },
      {
        name: "Lease Agreement",
        href: "/dashboard/jpcc/rentease/lease-agreement",
      },
      {
        name: "One-time Payment Certificate",
        href: "/dashboard/jpcc/rentease/payment-certificate",
      },
    ],
  },
  {
    name: "BPSP",
    icon: Home,
    href: "#",
    subItems: adminLinks,
  },
];

const jpccMerchantLinks = [
  {
    name: "Payment Gateway / ペイメントゲートウェイ",
    icon: Globe,
    href: "#", // Parent item, no direct link
    subItems: [
      { name: "Dashboard", href: "/dashboard/jpcc/payment-gateway/dashboard" },
      { name: "Payment", href: "/dashboard/jpcc/payment-gateway/payment" },
    ],
  },
  {
    name: "Account Management / アカウント管理",
    href: "/dashboard/jpcc/account-management",
    icon: UserCog,
  },
  {
    name: "BPSP",
    icon: Home,
    href: "#",
    subItems: merchantLinks,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAppStore();
  const [open, setOpen] = useState(false);

  // State to track open/closed sections. Default all open.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "JPCC Services": true,
    "BPSP Administration": true,
    "BPSP Merchant": true,
  });

  // State to track open/closed sub-menus
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const renderLabel = (name: string) => {
    if (name.includes(" / ")) {
      const [en, ja] = name.split(" / ");
      return (
        <div className="flex flex-col items-start text-left leading-tight">
          <span>{en}</span>
          <span className="text-[10px] opacity-80 font-normal">{ja}</span>
        </div>
      );
    }
    return <span>{name}</span>;
  };

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  let navGroups: { title?: string; links: any[] }[] = [];
  let portalTitle = "BPSP Merchant Portal";

  if (currentUser?.role === "admin") {
    navGroups = [{ links: adminLinks }];
    portalTitle = "BPSP Admin Portal";
  } else if (currentUser?.role === "jpcc_admin") {
    navGroups = [{ title: "JPCC", links: jpccAdminLinks }];
    portalTitle = "JPCC Admin Portal";
  } else if (currentUser?.role === "merchant_jpcc") {
    navGroups = [{ title: "JPCC", links: jpccMerchantLinks }];
    portalTitle = "JPCC Merchant Portal";
  } else {
    navGroups = [{ links: merchantLinks }];
  }

  const isMerchant =
    currentUser?.role === "merchant_jpcc" ||
    !["admin", "jpcc_admin"].includes(currentUser?.role || "");

  // Check if sidebar has colored background (needs light text)
  const hasColoredBg =
    currentUser?.role === "jpcc_admin" ||
    currentUser?.role === "merchant_jpcc" ||
    currentUser?.role === "merchant";

  // Get sidebar background color based on role to match login page buttons
  const getSidebarBgColor = () => {
    if (currentUser?.role === "jpcc_admin") {
      return ""; // Will use inline style for custom color
    } else if (currentUser?.role === "merchant_jpcc") {
      return "bg-teal-600"; // Teal matching Merchant (JPCC + BPSP) button
    } else if (currentUser?.role === "merchant") {
      return "bg-[oklch(0.4_0.15_150)]"; // Green matching Merchant (BPSP Only) button
    }
    return "bg-background"; // Default for admin
  };

  const getSidebarBgStyle = () => {
    if (currentUser?.role === "jpcc_admin") {
      return { backgroundColor: "#145DB4" };
    }
    return {};
  };

  const sidebarBgColor = getSidebarBgColor();
  const sidebarBgStyle = getSidebarBgStyle();

  const NavContent = () => (
    <div
      className={cn(
        "flex h-full flex-col gap-4 py-4",
        hasColoredBg && "text-slate-50"
      )}
    >
      <div className="px-6 py-2">
        <h1
          className={cn(
            "text-xl font-bold",
            hasColoredBg ? "text-white" : "text-primary"
          )}
        >
          {portalTitle}
        </h1>
        <p
          className={cn(
            "text-xs",
            hasColoredBg ? "text-slate-300" : "text-muted-foreground"
          )}
        >
          Business Payments Simplified
        </p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navGroups.map((group, groupIndex) => {
          if (!group.title) {
            // Render flat list if no title
            return (
              <div key={groupIndex} className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                        isActive ? "font-bold" : "font-medium",
                        isActive
                          ? hasColoredBg
                            ? "bg-black/20 text-white"
                            : "bg-primary text-primary-foreground"
                          : hasColoredBg
                          ? "text-slate-300 hover:bg-black/20 hover:text-white"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {renderLabel(link.name)}
                    </Link>
                  );
                })}
              </div>
            );
          }

          const isOpen = openSections[group.title] ?? true;

          return (
            <div key={groupIndex} className="space-y-1">
              <button
                onClick={() => toggleSection(group.title!)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors rounded-md cursor-pointer",
                  hasColoredBg
                    ? "text-white bg-black/20 hover:bg-black/30 border border-white/20"
                    : "text-foreground bg-muted/80 hover:bg-muted border border-border/50 font-semibold"
                )}
              >
                <span>{group.title}</span>
                {isOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>

              {isOpen && (
                <div className="space-y-1">
                  {group.links.map((link) => {
                    const Icon = link.icon;

                    // Handle items with sub-menus
                    if (link.subItems) {
                      const isSubMenuOpen = openSubMenus[link.name] ?? false;
                      const isChildActive = link.subItems.some(
                        (sub: any) => pathname === sub.href
                      );

                      return (
                        <div key={link.name} className="space-y-1">
                          <button
                            onClick={() => toggleSubMenu(link.name)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                              isChildActive ? "font-bold" : "font-medium",
                              hasColoredBg
                                ? "hover:bg-black/20 hover:text-white"
                                : "hover:bg-muted hover:text-foreground",
                              isChildActive
                                ? hasColoredBg
                                  ? "text-white"
                                  : "text-foreground"
                                : hasColoredBg
                                ? "text-slate-300"
                                : "text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 shrink-0" />
                              {renderLabel(link.name)}
                            </div>
                            {isSubMenuOpen ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </button>

                          {isSubMenuOpen && (
                            <div
                              className={cn(
                                "ml-9 space-y-1 border-l pl-2",
                                hasColoredBg ? "border-white/20" : ""
                              )}
                            >
                              {link.subItems.map((subItem: any) => {
                                const isSubActive = pathname === subItem.href;
                                return (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                      "block rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                                      isSubActive ? "font-bold" : "font-medium",
                                      isSubActive
                                        ? hasColoredBg
                                          ? "bg-black/20 text-white"
                                          : "bg-primary/10 text-primary"
                                        : hasColoredBg
                                        ? "text-slate-300 hover:bg-black/20 hover:text-white"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                  >
                                    {renderLabel(subItem.name)}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Handle regular items
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                          isActive ? "font-bold" : "font-medium",
                          isActive
                            ? hasColoredBg
                              ? "bg-black/20 text-white"
                              : "bg-primary text-primary-foreground"
                            : hasColoredBg
                            ? "text-slate-300 hover:bg-black/20 hover:text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {renderLabel(link.name)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="px-4 mt-auto">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            hasColoredBg
              ? "text-slate-300 hover:text-red-300 hover:bg-black/20"
              : "text-muted-foreground hover:text-destructive"
          )}
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden border-r md:block md:w-64 lg:w-72 fixed inset-y-0 left-0 z-30",
          sidebarBgColor,
          hasColoredBg ? "border-white/20" : "border-border"
        )}
        style={sidebarBgStyle}
      >
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className={cn(
            "p-0 w-72",
            sidebarBgColor,
            hasColoredBg ? "border-white/20" : ""
          )}
          style={sidebarBgStyle}
        >
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
