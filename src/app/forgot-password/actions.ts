'use server'

import { MOCK_USERS } from "@/lib/mock-data";

export type ForgotPasswordResult =
    | { success: true; message: string }
    | { success: false; error: string };

export async function requestPasswordReset(formData: FormData): Promise<ForgotPasswordResult> {
    const email = formData.get('email') as string;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email) {
        return { success: false, error: 'メールアドレスを入力してください。' };
    }

    // 1. Validate format (Basic check, Zod in client handles detailed check)
    if (!email.includes('@')) {
        return { success: false, error: '有効なメールアドレスを入力してください。' };
    }

    // 2. Check whether the email exists in the merchant_user table.
    const user = MOCK_USERS.find(u => u.email === email);

    // 3. If the user exists, register token... (Simulated)
    if (user) {
        console.log(`[Mock Email Service] Sending password reset email to ${email}`);
        console.log(`[Mock Email Service] Token: mock-token-for-${user.id}`);
        console.log(`[Mock Email Service] Link: http://localhost:3000/reset-password?token=mock-token-for-${user.id}`);
    } else {
        console.log(`[Mock Email Service] Email ${email} not found, but sending success message for security.`);
    }

    // 4. Generate tokenized URL and send email (Simulated above)

    // 5. On success, display "Email Sent" screen.
    // We return success regardless of whether the user exists to avoid email enumeration.
    return {
        success: true,
        message: 'パスワード再発行メールを送信しました。メールボックスをご確認ください。'
    };
}
