'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    CreditCard,
    History,
    Users,
    Settings,
    LogOut,
    Menu
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const merchantLinks = [
    { name: 'Dashboard / ダッシュボード', href: '/dashboard/merchant', icon: LayoutDashboard },
    { name: 'Invoices / 請求書', href: '/dashboard/merchant/invoices', icon: FileText },
    { name: 'Make Payment / 支払い', href: '/dashboard/merchant/payment', icon: CreditCard },
    { name: 'Payments / 履歴', href: '/dashboard/merchant/history', icon: History },
];

const adminLinks = [
    { name: 'Dashboard / ダッシュボード', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Payouts / 支払い管理', href: '/dashboard/admin/payouts', icon: CreditCard },
    { name: 'Tenants / テナント管理', href: '/dashboard/admin/tenants', icon: Users },
    { name: 'Settings / 設定', href: '/dashboard/admin/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { currentUser, logout } = useAppStore();
    const [open, setOpen] = useState(false);

    const links = currentUser?.role === 'admin' ? adminLinks : merchantLinks;
    const portalTitle = currentUser?.role === 'admin' ? 'BPSP Admin Portal' : 'BPSP Merchant Portal';

    const NavContent = () => (
        <div className="flex h-full flex-col gap-4 py-4">
            <div className="px-6 py-2">
                <h1 className="text-xl font-bold text-primary">{portalTitle}</h1>
                <p className="text-xs text-muted-foreground">Business Payments Simplified</p>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="px-4 mt-auto">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                        logout();
                        window.location.href = '/';
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden border-r bg-background md:block md:w-64 lg:w-72 fixed inset-y-0 left-0 z-30">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <NavContent />
                </SheetContent>
            </Sheet>
        </>
    );
}
