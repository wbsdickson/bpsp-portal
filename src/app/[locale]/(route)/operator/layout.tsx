import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppUser } from "@/types/user";
import { ModalProvider } from "./_providers/modal-provider";
import { SearchProvider } from "@/context/search-provider";
import { AppSidebar } from "./_components/operator-sidebar";
import { UserPreferencesProvider } from "./_components/user-preferences-provider";
import { Header } from "../_components/header";
import { AbilityProvider } from "../_providers/ability-provider";

export default async function NewOperatorLayout({
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

  if (
    !currentUser?.role ||
    (currentUser.role !== "backoffice_admin" &&
      currentUser.role !== "backoffice_staff")
  ) {
    redirect(`/${locale}/merchant/dashboard`);
  }

  return (
    <SearchProvider>
      <UserPreferencesProvider>
         <AbilityProvider>
        <SidebarProvider>
          <ModalProvider />
          <AppSidebar />
          <SidebarInset>
            <Header currentUser={currentUser} />
            <div className="flex-1 overflow-auto bg-gray-50">
              <div className="h-full p-6">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
        </AbilityProvider>
      </UserPreferencesProvider>
    </SearchProvider>
  );
}
