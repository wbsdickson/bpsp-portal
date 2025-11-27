"use server";

import { z } from "zod";

const invoiceAutoSettingSchema = z.object({
    scheduleName: z.string().min(1, "Schedule name is required"),
    clientId: z.string().min(1, "Client is required"),
    intervalType: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    intervalValue: z.coerce.number().min(1, "Interval value must be at least 1"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    templateId: z.string().min(1, "Template is required"),
    enabled: z.coerce.boolean(),
});

export async function createInvoiceAutoSettingAction(prevState: any, formData: FormData) {
    const validatedFields = invoiceAutoSettingSchema.safeParse({
        scheduleName: formData.get("scheduleName"),
        clientId: formData.get("clientId"),
        intervalType: formData.get("intervalType"),
        intervalValue: formData.get("intervalValue"),
        startDate: formData.get("startDate") || undefined,
        endDate: formData.get("endDate") || undefined,
        templateId: formData.get("templateId"),
        enabled: formData.get("enabled") === 'true',
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

    // Calculate next issuance date (Mock logic)
    const nextIssuanceDate = new Date();
    nextIssuanceDate.setMonth(nextIssuanceDate.getMonth() + 1); // Default to next month for now

    return {
        success: true,
        message: "Auto-issuance schedule has been registered.",
        data: {
            ...validatedFields.data,
            id: `auto_${Math.random().toString(36).substr(2, 9)}`,
            nextIssuanceDate: nextIssuanceDate.toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        }
    };
}

export async function updateInvoiceAutoSettingAction(prevState: any, formData: FormData) {
    const id = formData.get("id");
    if (!id) return { success: false, message: "ID is required" };

    const validatedFields = invoiceAutoSettingSchema.safeParse({
        scheduleName: formData.get("scheduleName"),
        clientId: formData.get("clientId"),
        intervalType: formData.get("intervalType"),
        intervalValue: formData.get("intervalValue"),
        startDate: formData.get("startDate") || undefined,
        endDate: formData.get("endDate") || undefined,
        templateId: formData.get("templateId"),
        enabled: formData.get("enabled") === 'true',
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
        message: "Auto-issuance schedule has been updated.",
        data: {
            id: id as string,
            ...validatedFields.data,
            updatedAt: new Date().toISOString(),
        }
    };
}

export async function deleteInvoiceAutoSettingAction(prevState: any, formData: FormData) {
    const id = formData.get("id");

    if (!id) {
        return { success: false, message: "ID is required" };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
        message: "Auto-issuance schedule has been deleted.",
        data: { id }
    };
}
