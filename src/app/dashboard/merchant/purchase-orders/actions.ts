"use server";

import { z } from "zod";

const purchaseOrderItemSchema = z.object({
    itemId: z.string().optional(),
    name: z.string().min(1, "Item name is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.coerce.number().min(0, "Unit price must be non-negative"),
    taxId: z.string().min(1, "Tax category is required"),
});

const purchaseOrderSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    poDate: z.string().min(1, "Purchase Order date is required"),
    items: z.array(purchaseOrderItemSchema).min(1, "At least one item is required"),
    notes: z.string().optional(),
});

export async function createPurchaseOrderAction(prevState: any, formData: FormData) {
    // Parse items from JSON string
    let items = [];
    try {
        items = JSON.parse(formData.get("items") as string);
    } catch (e) {
        return { success: false, message: "Invalid items data" };
    }

    const validatedFields = purchaseOrderSchema.safeParse({
        clientId: formData.get("clientId"),
        poDate: formData.get("poDate"),
        items: items,
        notes: formData.get("notes") || undefined,
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    // Calculate total amount
    const totalAmount = validatedFields.data.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice);
    }, 0);

    // Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Purchase Order has been created.",
        data: {
            ...validatedFields.data,
            id: `po_${Math.random().toString(36).substr(2, 9)}`,
            poNumber: `PO-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            status: 'draft',
            amount: totalAmount,
            currency: 'USD',
            createdAt: new Date().toISOString(),
            items: validatedFields.data.items.map((item, index) => ({
                ...item,
                id: `poi_${Math.random().toString(36).substr(2, 9)}`,
                amount: item.quantity * item.unitPrice
            }))
        }
    };
}

export async function updatePurchaseOrderAction(prevState: any, formData: FormData) {
    const id = formData.get("id");
    if (!id) return { success: false, message: "ID is required" };

    // Parse items from JSON string
    let items = [];
    try {
        items = JSON.parse(formData.get("items") as string);
    } catch (e) {
        return { success: false, message: "Invalid items data" };
    }

    const validatedFields = purchaseOrderSchema.safeParse({
        clientId: formData.get("clientId"),
        poDate: formData.get("poDate"),
        items: items,
        notes: formData.get("notes") || undefined,
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    // Calculate total amount
    const totalAmount = validatedFields.data.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice);
    }, 0);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Purchase Order has been updated.",
        data: {
            id: id as string,
            ...validatedFields.data,
            amount: totalAmount,
            updatedAt: new Date().toISOString(),
            items: validatedFields.data.items.map((item) => ({
                ...item,
                id: `poi_${Math.random().toString(36).substr(2, 9)}`, // Regenerate IDs for simplicity in mock
                amount: item.quantity * item.unitPrice
            }))
        }
    };
}

export async function deletePurchaseOrderAction(prevState: any, formData: FormData) {
    const id = formData.get("id");

    if (!id) {
        return { success: false, message: "ID is required" };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
        message: "Purchase Order has been deleted.",
        data: { id }
    };
}
