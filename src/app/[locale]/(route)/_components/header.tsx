"use client";

import { Separator } from "@/components/ui/separator";
import { ConditionalSidebarTrigger } from "./conditional-sidebar-trigger";
import { TitleBreadcrumb } from "./title-breadcum";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { TeamSwitcher } from "@/components/team-switcher-new";
import { HeaderButtons } from "./header-buttons";
import { AppUser } from "@/types/user";

export function Header({ currentUser }: { currentUser: AppUser }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear">
      <div className="flex flex-1 items-center gap-4 px-4">
        <ConditionalSidebarTrigger />

        {/* Dynamic Breadcrumb */}
        <TitleBreadcrumb />
      </div>

      {/* Right side - Search and User */}
      <div className="flex items-center gap-4 px-4">
        <Search />

        <Button
          variant="secondary"
          size="icon-sm"
          className="relative rounded-full"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <HeaderButtons />

        <Separator orientation="vertical" className="h-6! w-px self-center" />
        <TeamSwitcher
          name={currentUser.name}
          role={currentUser.role}
          email={currentUser.email}
          companyName={currentUser.companyName}
        />
      </div>
    </header>
  );
}
