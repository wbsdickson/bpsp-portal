"use server";

import { z } from "zod";

const itemSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    unitPrice: z.string().optional(), // Form data comes as string
    taxId: z.string().min(1, "Tax category is required"),
});

export async function createItem(prevState: any, formData: FormData) {
    const validatedFields = itemSchema.safeParse({
        name: formData.get("name"),
        unitPrice: formData.get("unitPrice") || undefined,
        taxId: formData.get("taxId"),
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
        message: "Item has been registered.",
        data: {
            ...validatedFields.data,
            unitPrice: validatedFields.data.unitPrice ? Number(validatedFields.data.unitPrice) : undefined,
            id: `item_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
        }
    };
}

export async function updateItemAction(prevState: any, formData: FormData) {
    const id = formData.get("id");
    const validatedFields = itemSchema.safeParse({
        name: formData.get("name"),
        unitPrice: formData.get("unitPrice") || undefined,
        taxId: formData.get("taxId"),
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
        message: "Item information has been updated.",
        data: {
            id,
            ...validatedFields.data,
            unitPrice: validatedFields.data.unitPrice ? Number(validatedFields.data.unitPrice) : undefined,
        }
    };
}

export async function deleteItemAction(prevState: any, formData: FormData) {
    const id = formData.get("id");

    if (!id) {
        return { success: false, message: "Item ID is required" };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
        message: "Item has been deleted.",
        data: { id }
    };
}
