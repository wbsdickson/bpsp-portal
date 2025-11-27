"use server";

import { z } from "zod";

const taxSettingsSchema = z.object({
    defaultTaxId: z.string().min(1, "Tax selection is required"),
    invoicePrefix: z.string().max(50, "Prefix must be 50 characters or less").optional(),
    enableCreditPayment: z.string().optional(), // Checkbox sends "on" or nothing
});

export async function updateTaxSettings(prevState: any, formData: FormData) {
    const validatedFields = taxSettingsSchema.safeParse({
        defaultTaxId: formData.get("defaultTaxId"),
        invoicePrefix: formData.get("invoicePrefix"),
        enableCreditPayment: formData.get("enableCreditPayment"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    // Simulate DB update
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Tax settings have been updated.",
    };
}
