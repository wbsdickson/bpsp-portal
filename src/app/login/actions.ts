'use server'

import { MOCK_USERS } from "@/lib/mock-data";
import { User } from "@/lib/types";

export type LoginResult =
    | { success: true; user: User }
    | { success: false; error: string };

export async function authenticateUser(formData: FormData): Promise<LoginResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!email || !password) {
        return { success: false, error: 'メールアドレスとパスワードを入力してください。' };
    }

    // Find user by email
    // In a real app, we would hash the password and compare it.
    // Here we assume a default password "password" for all mock users for simplicity,
    // or we could just check if the user exists since we don't have passwords in mock data.
    // Let's assume password is "password123" for everyone.

    const user = MOCK_USERS.find(u => u.email === email);

    if (!user) {
        return { success: false, error: 'メールアドレスまたはパスワードが正しくありません。' };
    }

    // Check password (mock)
    if (password !== 'password123') {
        return { success: false, error: 'メールアドレスまたはパスワードが正しくありません。' };
    }

    // Check if account is locked/suspended
    if (user.status === 'suspended') {
        return { success: false, error: 'アカウントがロックされています。' };
    }

    // Return user info on success
    return { success: true, user };
}
