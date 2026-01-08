"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
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
  console.log(routes);
  const locale = useLocale();
  const pathname = usePathname();

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
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="before:bg-border/50 relative ml-6 border-l-0 pl-3 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-px">
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
              item.isActive &&
                "before:bg-border before:absolute before:-left-3 before:top-1/2 before:z-10 before:h-px before:w-3 before:-translate-y-1/2",
            )}
          >
            <SidebarMenuSubButton asChild isActive={item.isActive}>
              <Link href={href}>
                <span
                  className={cn(
                    item.isActive && "font-bold",
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
              <span className={cn(item.isActive && "font-bold")}>
                {item.label}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <SidebarGroup>
      <SidebarMenu>{renderRoute(processedRoutes)}</SidebarMenu>
    </SidebarGroup>
  );
}
