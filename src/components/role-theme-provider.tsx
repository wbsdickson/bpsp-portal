'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function RoleThemeProvider({ children }: { children: React.ReactNode }) {
    const { currentUser } = useAppStore();

    useEffect(() => {
        const root = document.body;
        // Remove all role attributes first
        root.removeAttribute('data-role');

        if (currentUser?.role) {
            root.setAttribute('data-role', currentUser.role);
        }
    }, [currentUser]);

    return <>{children}</>;
}
