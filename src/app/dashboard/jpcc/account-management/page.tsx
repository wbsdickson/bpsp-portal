"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileForm } from "./user-profile-form";
import { CompanyInfoForm } from "./company-info-form";
import { MemberList } from "./members/member-list";
import { ClientList } from "./clients/client-list";
import { BankAccountList } from "./bank-accounts/bank-account-list";
import { CardList } from "./cards/card-list";
import { TaxSettingsForm } from "./settings/tax-settings-form";
import { useAppStore } from "@/lib/store";

export default function AccountManagementPage() {
    const { currentUser } = useAppStore();

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    // Determine if user can see Company Info tab
    // Assuming 'merchant_jpcc' and 'merchant' roles can see it.
    // 'admin' and 'jpcc_admin' might not have a company profile in this context, or they view a different one.
    // For this feature (MERCHANT_006), it's for merchants.
    const showCompanyTab = currentUser.role === 'merchant' || currentUser.role === 'merchant_jpcc';

    // Show members tab if user is part of a merchant organization
    // In our mock, 'merchant' role implies owner. 'merchant_jpcc' implies owner.
    // We also added 'memberRole' for staff/viewer.
    const showMembersTab = showCompanyTab || !!currentUser.merchantId;

    // Show clients tab - same logic as members usually, accessible to merchant users
    const showClientsTab = showMembersTab;

    // Show bank accounts tab - accessible to merchant users
    const showBankAccountsTab = showMembersTab;

    // Show cards tab - accessible to merchant users
    const showCardsTab = showMembersTab;

    // Show settings tab - accessible to merchant users (owner only for editing, but maybe view for others?)
    // The requirement says "Access Control: Only owner-role users can edit."
    // It doesn't explicitly say others can't view, but usually settings are restricted.
    // Let's show it for all merchant users, but the form handles read-only state or hides itself.
    const showSettingsTab = showMembersTab;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Account Management</h2>
                <p className="text-muted-foreground">Manage your account settings and company profile.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">User Profile</TabsTrigger>
                    {showCompanyTab && <TabsTrigger value="company">Company Info</TabsTrigger>}
                    {showMembersTab && <TabsTrigger value="members">Members</TabsTrigger>}
                    {showClientsTab && <TabsTrigger value="clients">Clients</TabsTrigger>}
                    {showBankAccountsTab && <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>}
                    {showCardsTab && <TabsTrigger value="cards">Payment Cards</TabsTrigger>}
                    {showSettingsTab && <TabsTrigger value="settings">Settings</TabsTrigger>}
                </TabsList>
                <TabsContent value="profile" className="space-y-4">
                    <UserProfileForm />
                </TabsContent>
                {showCompanyTab && (
                    <TabsContent value="company" className="space-y-4">
                        <CompanyInfoForm />
                    </TabsContent>
                )}
                {showMembersTab && (
                    <TabsContent value="members" className="space-y-4">
                        <MemberList />
                    </TabsContent>
                )}
                {showClientsTab && (
                    <TabsContent value="clients" className="space-y-4">
                        <ClientList />
                    </TabsContent>
                )}
                {showBankAccountsTab && (
                    <TabsContent value="bank-accounts" className="space-y-4">
                        <BankAccountList />
                    </TabsContent>
                )}
                {showCardsTab && (
                    <TabsContent value="cards" className="space-y-4">
                        <CardList />
                    </TabsContent>
                )}
                {showSettingsTab && (
                    <TabsContent value="settings" className="space-y-4">
                        <TaxSettingsForm />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
