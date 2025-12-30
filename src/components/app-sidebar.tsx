"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  CreditCard,
  FileText,
  Frame,
  GalleryVerticalEnd,
  Grid2X2,
  HelpCircle,
  Link2,
  Map,
  Bell,
  PieChart,
  Settings,
  Settings2,
  SquareTerminal,
  Plus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: Frame,
    },
    {
      name: "Accounts",
      url: "/accounts",
      icon: PieChart,
    },
    {
      name: "Merchants",
      url: "/merchants",
      icon: Map,
    },
  ],
};

const operatorRoutes = [
  {
    label: "Dashboard",
    route: "operator/dashboard",
  },
  {
    label: "Invoices",
    route: "operator/invoices",
  },
  // {
  //   label: "Payment",
  //   route: "payment",
  //   children: [
  //     {
  //       label: "Transactions",
  //       route: "transactions",
  //     },
  //     {
  //       label: "Chargebacks",
  //       route: "chargeback",
  //     },
  //     {
  //       label: "Checkout Sessions",
  //       route: "checkout-sessions",
  //     },
  //     {
  //       label: "Payment Links",
  //       route: "payment-links",
  //     },
  //     {
  //       label: "Payment Methods",
  //       route: "payment-methods",
  //     },
  //     {
  //       label: "Subscriptions",
  //       route: "subscriptions",
  //     },
  //     {
  //       label: "Webhooks",
  //       route: "webhooks",
  //     },
  //   ],
  // },
  // {
  //   label: "Gateway Management",
  //   route: "gateway-management",
  //   children: [
  //     {
  //       label: "Routing",
  //       route: "routing",
  //     },
  //     {
  //       label: "Mid",
  //       route: "mid",
  //     },
  //     {
  //       label: "Fee",
  //       route: "fee",
  //     },
  //     {
  //       label: "Blocked Card",
  //       route: "blocked-card",
  //     },
  //   ],
  // },
];

const merchantRoutes = [
  {
    label: "Dashboard",
    route: "merchant/dashboard",
  },
  {
    label: "Account Information Management",
    route: "merchant/account",
  },
  {
    label: "Delivery Notes",
    route: "merchant/delivery-notes",
  },
  {
    label: "Finance",
    route: "merchant/finance",
  },
  {
    label: "History",
    route: "merchant/history",
  },
  {
    label: "Invoice Auto",
    route: "merchant/invoice-auto",
  },
  {
    label: "Invoices",
    route: "merchant/invoices",
  },
  {
    label: "Notifications",
    route: "merchant/notifications",
  },
  {
    label: "Payment",
    route: "merchant/payment",
  },
  {
    label: "Purchase Orders",
    route: "merchant/purchase-orders",
  },
  {
    label: "Quotations",
    route: "merchant/quotations",
  },
  {
    label: "Receipts",
    route: "merchant/receipts",
  },
  {
    label: "Simple Invoice Auto",
    route: "merchant/simple-invoice-auto",
  },
];

export function AppSidebar({
  role = "operator",
  ...props
}: React.ComponentProps<typeof Sidebar> & { role?: string }) {
  const routes = role === "merchant" ? merchantRoutes : operatorRoutes;
  const session = useSession();
  const user = session?.data?.user;
  const teams = [
    {
      name: user?.name ?? "",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ];
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher name={user?.name ?? ""} company={user?.email ?? ""} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain routes={routes} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-1 px-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Grid2X2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Apps
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <HelpCircle className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Help
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Bell className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Notifications
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Settings className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Settings
            </TooltipContent>
          </Tooltip>
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
              <DropdownMenuItem className="gap-3 py-2">
                <FileText className="size-4" />
                <span>Invoice</span>
                <DropdownMenuShortcut className="tracking-normal">
                  C I
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2">
                <CreditCard className="size-4" />
                <span>Subscription</span>
                <DropdownMenuShortcut className="tracking-normal">
                  C S
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2">
                <Link2 className="size-4" />
                <span>Payment link</span>
                <DropdownMenuShortcut className="tracking-normal">
                  C L
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2">
                <CreditCard className="size-4" />
                <span>Payment</span>
                <DropdownMenuShortcut className="tracking-normal">
                  C P
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
