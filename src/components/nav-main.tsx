"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ArrowRight } from "./icons";
import { LucideIcon } from "lucide-react";

type RouteType = {
  label: string;
  route: string;
  icon?: LucideIcon;
  isActive?: boolean;
  children?: RouteType[];
};

export function NavMain({
  routes,
  title,
}: {
  routes: RouteType[];
  title?: string;
}) {
  console.log(routes);
  const locale = useLocale();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const withLocale = (href: string) => {
    if (!href || href === "#") return href;
    if (href.startsWith("http://") || href.startsWith("https://")) return href;
    if (!href.startsWith("/")) return href;
    if (href.startsWith(`/${locale}/`)) return href;
    return `/${locale}${href}`;
  };

  type ProcessedRouteType = RouteType & {
    isActive: boolean;
    children?: ProcessedRouteType[];
  };

  const processedRoutes = useMemo(() => {
    const checkActive = (item: RouteType): ProcessedRouteType => {
      const href = `/${item.route}`;
      // Check if current path is exactly this route or a sub-route
      const isSelfActive = pathname === href || pathname.startsWith(`${href}/`);

      let children: ProcessedRouteType[] | undefined = undefined;
      let isChildActive = false;

      if (item.children && item.children.length > 0) {
        children = item.children.map(checkActive);
        isChildActive = children.some((c) => c.isActive);
      }

      return {
        ...item,
        children,
        isActive: isSelfActive || isChildActive,
      };
    };

    return routes.map(checkActive);
  }, [routes, pathname, locale]);

  const renderRoute = (route: typeof processedRoutes, isSub = false) => {
    return route.map((item) => {
      if (item.children && item.children.length > 0) {
        // When collapsed, show dropdown menu instead of collapsible
        if (isCollapsed && !isSub) {
          return (
            <DropdownMenu key={item.label}>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={item.isActive}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                    <ArrowRight className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  className="w-56"
                >
                  {item.children.map((child) => {
                    const childHref = withLocale(`/${child.route}`);
                    return (
                      <DropdownMenuItem key={child.route} asChild>
                        <Link href={childHref}>
                          <span className={cn(child.isActive && "font-bold")}>
                            {child.label}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </SidebarMenuItem>
            </DropdownMenu>
          );
        }

        // When expanded, use collapsible as before
        return (
          <Collapsible
            key={item.label}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={item.isActive}
                >
                  {item.icon && <item.icon />}
                  <span className="truncate whitespace-nowrap">
                    {item.label}
                  </span>
                  <ArrowRight className="ml-auto shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="ml-6 pl-3">
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
          <SidebarMenuSubItem
            key={item.route}
            className={cn(
              "relative",
              "before:border-sidebar-border before:absolute before:-left-3 before:top-0 before:z-10 before:h-4 before:w-3 before:rounded-bl-md before:border-b before:border-l before:bg-transparent",
            )}
          >
            <SidebarMenuSubButton asChild isActive={item.isActive}>
              <Link href={href}>
                <span
                  className={cn(
                    item.isActive && "text-primary font-bold",
                    !item.isActive && "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      }

      return (
        <SidebarMenuItem key={item.route}>
          <SidebarMenuButton
            asChild
            tooltip={item.label}
            isActive={item.isActive}
          >
            <Link href={href}>
              {item.icon && <item.icon />}
              <span
                className={cn(
                  "truncate whitespace-nowrap",
                  item.isActive && "font-bold",
                )}
              >
                {item.label}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <SidebarGroup className="px-0.5">
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>{renderRoute(processedRoutes)}</SidebarMenu>
    </SidebarGroup>
  );
}
