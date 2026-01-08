"use client";

import * as React from "react";
import {
  FileText,
  Settings,
  Plus,
  Receipt,
  ScrollText,
  User,
  Store,
  type LucideIcon,
} from "lucide-react";

import { HelpPopover } from "./help-popover";
import { NotificationPopover } from "./notification-popover";

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
import { useTranslations } from "next-intl";
import { Link } from "next-view-transitions";

type FooterButton = {
  icon: LucideIcon;
  tooltipKey: string;
  url: string;
};

type QuickActionItem = {
  icon: LucideIcon;
  labelKey: string;
  shortcut: string;
  url: string;
};

const HEADER_BUTTONS: FooterButton[] = [
  {
    icon: Settings,
    tooltipKey: "footer.settings",
    url: "/operator/system-settings",
  },
];

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    icon: FileText,
    labelKey: "quickActions.invoice",
    shortcut: "C I",
    url: "/operator/merchant-management/invoices/create",
  },
  {
    icon: Receipt,
    labelKey: "quickActions.receipt",
    shortcut: "C S",
    url: "/operator/merchant-management/receipts/create",
  },
  {
    icon: ScrollText,
    labelKey: "quickActions.quotation",
    shortcut: "C S",
    url: "/operator/merchant-management/quotations/create",
  },
  {
    icon: User,
    labelKey: "quickActions.client",
    shortcut: "C S",
    url: "/operator/merchant-management/clients/create",
  },
  {
    icon: Store,
    labelKey: "quickActions.merchant",
    shortcut: "C L",
    url: "/operator/merchants/create",
  },
];

function LinkButton({
  icon: Icon,
  tooltip,
  url,
}: {
  icon: LucideIcon;
  tooltip: string;
  url: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          asChild
          className="hover:bg-muted-foreground/20 rounded-full"
        >
          <Link href={url}>
            <Icon />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function HeaderButtons() {
  const t = useTranslations("Operator.Sidebar");

  return (
    <div className="flex items-center gap-2">
      <HelpPopover />
      <NotificationPopover />
      <LinkButton
        icon={Settings}
        tooltip={t("footer.settings")}
        url="/operator/system-settings"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-2xs" className="rounded-full">
            <Plus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-56 rounded-xl p-2"
        >
          {QUICK_ACTIONS.map((action) => (
            <DropdownMenuItem
              key={action.labelKey}
              className="gap-3 py-2"
              asChild
            >
              <Link href={action.url}>
                <action.icon className="size-4" />
                <span>{t(action.labelKey)}</span>
                <DropdownMenuShortcut className="tracking-normal">
                  {action.shortcut}
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
