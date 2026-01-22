import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppUser } from "@/types/user";
import { AppSidebar } from "./_components/merchant-sidebar";
import { ModalProvider } from "./_providers/modal-provider";
import { SearchProvider } from "@/context/search-provider";
import { UserPreferencesProvider } from "@/app/[locale]/(route)/operator/_components/user-preferences-provider";
import { Header } from "../_components/header";
import { AbilityProvider } from "../_providers/ability-provider";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function RouteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const session = await auth();
  const currentUser = session?.user as AppUser;

  if (!currentUser) {
    redirect(`/${locale}/signin`);
  }

  if (
    !currentUser.role ||
    (currentUser.role !== "merchant_owner" &&
      currentUser.role !== "merchant_admin" &&
      currentUser.role !== "merchant_viewer")
  ) {
    redirect(`/${locale}/operator/dashboard`);
  }

  return (
    <SearchProvider>
      <UserPreferencesProvider>
          <AbilityProvider>
        <SidebarProvider data-role="merchant">
          <ModalProvider />
          <AppSidebar role={currentUser?.role} />
          <SidebarInset>
            <Header currentUser={currentUser} />
            <ScrollArea className="bg-background h-full">
              <div className="p-4">{children}</div>
            </ScrollArea>
          </SidebarInset>
        </SidebarProvider>
        </AbilityProvider>
      </UserPreferencesProvider>
    </SearchProvider>
  );
}
