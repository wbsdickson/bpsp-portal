"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function ConditionalSidebarTrigger() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Only show the trigger when sidebar is collapsed
  if (!isCollapsed) {
    return null;
  }

  return <SidebarTrigger className="-ml-1" />;
}
