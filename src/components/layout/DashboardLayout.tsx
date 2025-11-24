'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '@/lib/store';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { currentUser } = useAppStore();

    return (
        <div className="min-h-screen bg-muted/10" data-role={currentUser?.role}>
            <Sidebar />
            <Header />
            <main className="md:ml-64 lg:ml-72 p-6">
                {children}
            </main>
        </div>
    );
}
