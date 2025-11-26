'use server'

import { MOCK_USERS } from "@/lib/mock-data";

export type ResetPasswordResult =
    | { success: true; message: string }
    | { success: false; error: string };

export async function resetPassword(formData: FormData): Promise<ResetPasswordResult> {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 1. Retrieve and validate URL token.
    if (!token) {
        return { success: false, error: '再発行リンクが無効です。もう一度最初からやり直してください。' };
    }

    // Mock token validation: expect "mock-token-for-{userId}"
    if (!token.startsWith('mock-token-for-')) {
        return { success: false, error: '再発行リンクが無効です。有効期限切れの可能性があります。' };
    }

    const userId = token.replace('mock-token-for-', '');
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
        return { success: false, error: 'ユーザーが見つかりません。' };
    }

    // 2. Validate the input password.
    if (!password || password.length < 8) {
        return { success: false, error: 'パスワードは8文字以上で入力してください。' };
    }

    if (password !== confirmPassword) {
        return { success: false, error: 'パスワードが一致しません。' };
    }

    // 3. Update merchant_user.password_hash (Simulated)
    console.log(`[Mock DB] Updating password for user ${user.email} (${user.id}) to: ${password}`);

    // 4. Record to user_password_change_log (Simulated)
    console.log(`[Mock DB] Recording password change log for user ${user.id}`);

    // 5. Update user_forgot_password.used = 1 (Simulated)
    console.log(`[Mock DB] Marking token ${token} as used`);

    // 6. Redirect to the login screen (Handled by client after success response)

    return {
        success: true,
        message: 'パスワードを更新しました。新しいパスワードでログインしてください。'
    };
}
