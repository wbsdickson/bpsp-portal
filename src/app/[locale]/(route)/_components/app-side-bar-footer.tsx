import {
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronLeft, FileText, HelpCircle, Home, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { LAST_UPDATE } from "@/lib/build-info";

export function AppSideBarFooter({ t }: { t: (key: string) => string }) {
  const handleLogout = () => {
    signOut({ callbackUrl: `/signin` });
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        {/* Support */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={t("support")}>
            <a href="/support" target="_blank">
              <HelpCircle className="h-4 w-4" />
              <span>{t("support")}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Company Website */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={t("companyWebsite")}>
            <a
              href="https://www.jccard.co.jp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Home className="h-4 w-4" />
              <span>{t("companyWebsite")}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Privacy Policy */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={t("privacyPolicy")}>
            <a href="/privacy-policy" target="_blank">
              <FileText className="h-4 w-4" />
              <span>{t("privacyPolicy")}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Terms of Use */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={t("termsOfUse")}>
            <a href="/terms-of-use" target="_blank">
              <FileText className="h-4 w-4" />
              <span>{t("termsOfUse")}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Logout */}
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={t("logout")}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>{t("logout")}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Copyright */}
      <div className="border-sidebar-border border-t p-4 text-center">
        <p className="text-primary text-xs font-medium group-data-[collapsible=icon]:hidden">
          © Japan Credit Card Co., LTD.
        </p>
        <p className="text-muted-foreground mt-1 text-[10px] group-data-[collapsible=icon]:hidden">
          Last update: {LAST_UPDATE}
        </p>
        <div className="text-primary hidden text-xs font-medium group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center whitespace-nowrap">
          © JPCC
        </div>
      </div>
    </SidebarFooter>
  );
}
