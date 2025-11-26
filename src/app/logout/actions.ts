'use server'

import { MOCK_USERS } from "@/lib/mock-data";

export async function logoutUser(userId: string): Promise<{ success: true }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // 1. Delete all current session information (user ID, permissions, etc.)
    // In a real app with server-side sessions (e.g. cookies), we would clear them here.
    // Since we are using client-side store for "session" in this mock, 
    // this server action mainly serves to record the log.

    // 2. After session destruction, invalidate cookies on the server side.
    // (No cookies to invalidate in this mock setup, but this is where it would happen)

    // 3. Record logout event in user_login_log.
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
        console.log(`[Mock DB] Recording logout event for user ${user.email} (${user.id})`);
    }

    // 4. Redirect to the login screen.
    // The client will handle the redirect after clearing the store.

    return { success: true };
}
