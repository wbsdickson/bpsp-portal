"use client";

import { HelpCircle, BookOpen, LifeBuoy, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HelpPopover() {
  const t = useTranslations("Operator.Sidebar.footer");

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="hover:bg-muted-foreground/20 rounded-full"
            >
              <HelpCircle className="size-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {t("help")}
        </TooltipContent>
      </Tooltip>
      <PopoverContent side="top" align="start" className="w-56 p-2">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" className="h-9 justify-start gap-2 px-2">
            <BookOpen className="size-4" />
            <span>Documentation</span>
          </Button>
          <Button variant="ghost" className="h-9 justify-start gap-2 px-2">
            <LifeBuoy className="size-4" />
            <span>Support</span>
          </Button>
          <Button variant="ghost" className="h-9 justify-start gap-2 px-2">
            <Zap className="size-4" />
            <span>Changelog</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
