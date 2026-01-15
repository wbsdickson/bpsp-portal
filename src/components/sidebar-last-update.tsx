"use client";

import { LAST_UPDATE } from "@/lib/build-info";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SidebarLastUpdate() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="border-t px-2 py-2">
      <div
        className={cn(
          "text-muted-foreground text-xs",
          isCollapsed && "text-center",
        )}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-1">
            <div className="truncate text-[10px]">Last update</div>
            <div className="truncate text-[9px]">{LAST_UPDATE}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="text-[10px]">Last update</div>
            <div className="text-[9px]">{LAST_UPDATE}</div>
          </div>
        )}
      </div>
    </div>
  );
}
