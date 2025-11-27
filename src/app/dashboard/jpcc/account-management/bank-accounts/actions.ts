"use server";

import { z } from "zod";

const bankAccountSchema = z.object({
    bankName: z.string().min(1, "Bank name is required"),
    branchName: z.string().optional(),
    accountType: z.enum(["savings", "checking"] as [string, ...string[]]),
    accountNumber: z.string().regex(/^\d{7}$/, "Account number must be 7 digits"),
    accountHolder: z.string().min(1, "Account holder name is required"),
});

export async function createBankAccount(prevState: any, formData: FormData) {
    const validatedFields = bankAccountSchema.safeParse({
        bankName: formData.get("bankName"),
        branchName: formData.get("branchName") || undefined,
        accountType: formData.get("accountType"),
        accountNumber: formData.get("accountNumber"),
        accountHolder: formData.get("accountHolder"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    // Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Bank account registered successfully",
        data: {
            ...validatedFields.data,
            id: `ba_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
        }
    };
}

export async function updateBankAccount(prevState: any, formData: FormData) {
    const id = formData.get("id");
    const validatedFields = bankAccountSchema.safeParse({
        bankName: formData.get("bankName"),
        branchName: formData.get("branchName") || undefined,
        accountType: formData.get("accountType"),
        accountNumber: formData.get("accountNumber"),
        accountHolder: formData.get("accountHolder"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Bank account updated successfully",
        data: {
            id,
            ...validatedFields.data,
        }
    };
}

export async function deleteBankAccountAction(prevState: any, formData: FormData) {
    const id = formData.get("id");

    if (!id) {
        return { success: false, message: "Bank Account ID is required" };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
        message: "Bank account deleted successfully",
        data: { id }
    };
}
