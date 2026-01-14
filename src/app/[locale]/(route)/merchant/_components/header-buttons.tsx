"use client";

import * as React from "react";
import {
  FileText,
  Settings,
  Plus,
  CreditCard,
  Link2,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { HelpPopover } from "./help-popover";
import { NotificationPopover } from "./notification-popover";
import { UserPreferencesDialog } from "@/app/[locale]/(route)/operator/_components/user-preferences-dialog";

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

type QuickActionItem = {
  icon: LucideIcon;
  labelKey: string;
  shortcut: string;
  url: string;
};

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    icon: FileText,
    labelKey: "invoice",
    shortcut: "C I",
    url: "/merchant/invoice-management/create",
  },
  {
    icon: Zap,
    labelKey: "subscription",
    shortcut: "C S",
    url: "/merchant/invoice-auto-issuance/create",
  },
  {
    icon: Link2,
    labelKey: "paymentLink",
    shortcut: "C L",
    url: "/merchant/payment",
  },
  {
    icon: CreditCard,
    labelKey: "payment",
    shortcut: "C P",
    url: "/merchant/payment",
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
  const tFooter = useTranslations("Merchant.Sidebar.footer");
  const tQuickActions = useTranslations("Merchant.Sidebar.quickActions");
  const [preferencesOpen, setPreferencesOpen] = React.useState(false);
  const [dKeyCount, setDKeyCount] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only track 'D' key presses (case-insensitive)
      if (e.key.toLowerCase() === "d") {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setDKeyCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 10) {
            setPreferencesOpen(true);
            return 0; // Reset counter
          }
          return newCount;
        });

        // Reset counter after 1 second of inactivity
        timeoutRef.current = setTimeout(() => {
          setDKeyCount(0);
        }, 1000);
      } else {
        // Reset counter if any other key is pressed
        setDKeyCount(0);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        <HelpPopover />
        <NotificationPopover />
        <LinkButton
          icon={Settings}
          tooltip={tFooter("settings")}
          url="/merchant/document-output-settings"
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
                  <span>{tQuickActions(action.labelKey)}</span>
                  <DropdownMenuShortcut className="tracking-normal">
                    {action.shortcut}
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <UserPreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
      />
    </>
  );
}
