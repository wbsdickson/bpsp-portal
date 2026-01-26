import { SidebarHeader } from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronLeft, PanelLeftIcon } from "lucide-react";

export function AppSideBarHeader() {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarHeader className="bg-primary dark:bg-sidebar h-16 border-b">
      {isCollapsed ? (
        // Collapsed state - Centered icon logo
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/logo-icon.png"
            alt="JPCC"
            width={30}
            height={30}
            className="rounded-sm object-contain"
            priority
          />
        </div>
      ) : (
        // Expanded state - Full horizontal logo with arrow on right
        <div className="relative flex h-full items-center justify-between px-6">
          {/* JPCC Logo */}
          <div className="flex items-center">
            <Image
              src="/JPCC-horizontal-white.png"
              alt="JPCC"
              width={100}
              height={35}
              className="rounded-sm object-contain"
              priority
            />
          </div>

          {/* Toggle Button */}
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleSidebar}
            className="h-6 w-6 rounded-sm"
          >
            <PanelLeftIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </SidebarHeader>
  );
}
