"use server";

import { z } from "zod";

const deliveryNoteItemSchema = z.object({
    itemId: z.string().optional(),
    name: z.string().min(1, "Item name is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.coerce.number().min(0, "Unit price must be non-negative"),
    taxId: z.string().min(1, "Tax category is required"),
});

const deliveryNoteSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    deliveryDate: z.string().min(1, "Delivery date is required"),
    items: z.array(deliveryNoteItemSchema).min(1, "At least one item is required"),
    notes: z.string().optional(),
});

export async function createDeliveryNoteAction(prevState: any, formData: FormData) {
    // Parse items from JSON string
    let items = [];
    try {
        items = JSON.parse(formData.get("items") as string);
    } catch (e) {
        return { success: false, message: "Invalid items data" };
    }

    const validatedFields = deliveryNoteSchema.safeParse({
        clientId: formData.get("clientId"),
        deliveryDate: formData.get("deliveryDate"),
        items: items,
        notes: formData.get("notes"),
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
        message: "Delivery Note has been created.",
        data: {
            ...validatedFields.data,
            id: `dn_${Math.random().toString(36).substr(2, 9)}`,
            deliveryNoteNumber: `DN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            status: 'draft',
            amount: totalAmount,
            currency: 'USD',
            createdAt: new Date().toISOString(),
            items: validatedFields.data.items.map((item, index) => ({
                ...item,
                id: `dni_${Math.random().toString(36).substr(2, 9)}`,
                amount: item.quantity * item.unitPrice
            }))
        }
    };
}

export async function updateDeliveryNoteAction(prevState: any, formData: FormData) {
    const id = formData.get("id");
    if (!id) return { success: false, message: "ID is required" };

    // Parse items from JSON string
    let items = [];
    try {
        items = JSON.parse(formData.get("items") as string);
    } catch (e) {
        return { success: false, message: "Invalid items data" };
    }

    const validatedFields = deliveryNoteSchema.safeParse({
        clientId: formData.get("clientId"),
        deliveryDate: formData.get("deliveryDate"),
        items: items,
        notes: formData.get("notes"),
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
        message: "Delivery Note has been updated.",
        data: {
            id: id as string,
            ...validatedFields.data,
            amount: totalAmount,
            updatedAt: new Date().toISOString(),
            items: validatedFields.data.items.map((item) => ({
                ...item,
                id: `dni_${Math.random().toString(36).substr(2, 9)}`, // Regenerate IDs for simplicity in mock
                amount: item.quantity * item.unitPrice
            }))
        }
    };
}

export async function deleteDeliveryNoteAction(prevState: any, formData: FormData) {
    const id = formData.get("id");

    if (!id) {
        return { success: false, message: "ID is required" };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
        message: "Delivery Note has been deleted.",
        data: { id }
    };
}
