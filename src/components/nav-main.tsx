"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import { useLocale } from "next-intl";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type RouteType = {
  label: string;
  route: string;
  icon?: LucideIcon;
  isActive?: boolean;
  children?: RouteType[];
};

export function NavMain({ routes }: { routes: RouteType[] }) {
  const locale = useLocale();

  const withLocale = (href: string) => {
    if (!href || href === "#") return href;
    if (href.startsWith("http://") || href.startsWith("https://")) return href;
    if (!href.startsWith("/")) return href;
    if (href.startsWith(`/${locale}/`)) return href;
    return `/${locale}${href}`;
  };

  const renderRoute = (route: RouteType[], isSub = false) => {
    return route.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Collapsible
            key={item.label}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.label}>
                  {item.icon && <item.icon />}
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {renderRoute(item.children, true)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      }

      const href = withLocale(`/${item.route}`);

      if (isSub) {
        return (
          <SidebarMenuSubItem key={item.route}>
            <SidebarMenuSubButton asChild>
              <Link href={href}>
                <span>{item.label}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      }

      return (
        <SidebarMenuItem key={item.route}>
          <SidebarMenuButton asChild tooltip={item.label}>
            <Link href={href}>
              {item.icon && <item.icon />}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <SidebarGroup>
      <SidebarMenu>{renderRoute(routes)}</SidebarMenu>
    </SidebarGroup>
  );
}
