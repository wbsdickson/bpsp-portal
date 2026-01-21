import { SidebarHeader } from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";

export function AppSideBarHeader() {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarHeader className="bg-primary h-16">
      {isCollapsed ? (
        // Collapsed state - Centered icon logo
        <div className="flex h-16 w-full items-center justify-center">
          <Image
            src="/logo.png"
            alt="JPCC"
            width={40}
            height={40}
            className="rounded-sm bg-white object-contain"
            priority
          />
        </div>
      ) : (
        // Expanded state - Full horizontal logo with arrow on right
        <div className="relative flex h-16 items-center justify-between px-6">
          {/* JPCC Logo */}
          <div className="flex items-center">
            <Image
              src="/logo-fullname-horizontal.png"
              alt="JPCC"
              width={150}
              height={70}
              className="rounded-sm bg-white object-contain"
              priority
            />
          </div>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-6 w-6 rounded-sm bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </SidebarHeader>
  );
}
