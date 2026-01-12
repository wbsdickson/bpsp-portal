import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppUser } from "@/types/user";
import { AppSidebar } from "./_components/operator-sidebar";
import { HeaderButtons } from "./_components/header-buttons";
import { ModalProvider } from "./_providers/modal-provider";
import { SearchProvider } from "@/context/search-provider";
import { Search } from "@/components/search";
import { UserPreferencesProvider } from "./_components/user-preferences-provider";

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

  if (!session?.user) {
    redirect(`/${locale}/signin`);
  }

  if (!currentUser?.role || currentUser.role !== "admin") {
    redirect(`/${locale}/merchant/dashboard`);
  }

  return (
    <SearchProvider>
      <UserPreferencesProvider>
        <SidebarProvider>
          <ModalProvider />
          <AppSidebar />
          <SidebarInset>
            <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 bg-muted/50 transition-[width,height] ease-linear">
              <div className="flex flex-1 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Search />
              </div>
              <div className="flex items-center gap-2 px-4">
                <HeaderButtons />
              </div>
            </header>
            <div className="h-full bg-background p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </UserPreferencesProvider>
    </SearchProvider>
  );
}
