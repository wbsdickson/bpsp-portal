"use server";

import { z } from "zod";

const updateAccountSchema = z.object({
    userId: z.string(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.password && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type UpdateAccountState = {
    success?: boolean;
    message?: string;
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
};

export async function updateAccountInfo(
    prevState: UpdateAccountState,
    formData: FormData
): Promise<UpdateAccountState> {
    const rawData = {
        userId: formData.get("userId"),
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password") || undefined,
        confirmPassword: formData.get("confirmPassword") || undefined,
    };

    const validatedFields = updateAccountSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { userId, name, email, password } = validatedFields.data;

    // Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate Email Duplication Check
    // For demo purposes, let's say 'duplicate@example.com' is taken
    if (email === "duplicate@example.com") {
        return {
            success: false,
            message: "This email address is already in use.", // 既に使用されています。
            errors: {
                email: ["This email address is already in use."],
            },
        };
    }

    // Simulate DB Update
    console.log(`Updating user ${userId}:`, { name, email, password: password ? "***" : "unchanged" });

    if (password) {
        console.log(`Password updated for user ${userId}. Logged in user_password_change_log.`);
    }

    return {
        success: true,
        message: "Your account information has been updated.", // 登録情報を更新しました。
    };
}
