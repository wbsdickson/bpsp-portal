"use server";

import { z } from "zod";

const invoiceItemSchema = z.object({
    itemId: z.string().optional(),
    name: z.string().min(1, "Item name is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.coerce.number().min(0, "Unit price must be non-negative"),
    taxId: z.string().min(1, "Tax category is required"),
});

const invoiceSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    invoiceDate: z.string().min(1, "Invoice date is required"),
    dueDate: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    status: z.enum(['draft', 'pending']).default('draft'),
});

export async function createInvoiceAction(prevState: any, formData: FormData) {
    // Parse items from JSON string
    const itemsJson = formData.get("items") as string;
    let items = [];
    try {
        items = JSON.parse(itemsJson);
    } catch (e) {
        return { success: false, message: "Invalid items data" };
    }

    const validatedFields = invoiceSchema.safeParse({
        clientId: formData.get("clientId"),
        invoiceDate: formData.get("invoiceDate"),
        dueDate: formData.get("dueDate") || undefined,
        notes: formData.get("notes") || undefined,
        items: items,
        status: formData.get("status"),
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

    // Calculate totals
    const processedItems = validatedFields.data.items.map((item: any) => ({
        ...item,
        id: `ii_${Math.random().toString(36).substr(2, 9)}`,
        amount: item.quantity * item.unitPrice,
    }));

    const totalAmount = processedItems.reduce((sum: number, item: any) => sum + item.amount, 0);

    // Generate Invoice Number (Mock)
    const invoiceNumber = `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const id = `inv_${Math.random().toString(36).substr(2, 9)}`;

    return {
        success: true,
        message: "Invoice has been created.",
        data: {
            ...validatedFields.data,
            id,
            items: processedItems,
            amount: totalAmount,
            currency: 'USD', // Default for now
            invoiceNumber,
            createdAt: new Date().toISOString(),
            status: validatedFields.data.status as 'draft' | 'pending',
        }
    };
}

export async function updateInvoiceAction(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Invoice ID is required" };

    // Parse items from JSON string
    const itemsJson = formData.get("items") as string;
    let items = [];
    try {
        items = JSON.parse(itemsJson);
    } catch (e) {
        return { success: false, message: "Invalid items data" };
    }

    const validatedFields = invoiceSchema.safeParse({
        clientId: formData.get("clientId"),
        invoiceDate: formData.get("invoiceDate"),
        dueDate: formData.get("dueDate") || undefined,
        notes: formData.get("notes") || undefined,
        items: items,
        status: formData.get("status"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate totals
    const processedItems = validatedFields.data.items.map((item: any) => ({
        ...item,
        id: item.id || `ii_${Math.random().toString(36).substr(2, 9)}`,
        amount: item.quantity * item.unitPrice,
    }));

    const totalAmount = processedItems.reduce((sum: number, item: any) => sum + item.amount, 0);

    return {
        success: true,
        message: "Invoice has been updated.",
        data: {
            id,
            ...validatedFields.data,
            items: processedItems,
            amount: totalAmount,
            updatedAt: new Date().toISOString(),
        }
    };
}

export async function deleteInvoiceAction(prevState: any, formData: FormData) {
    const id = formData.get("id");

    if (!id) {
        return { success: false, message: "Invoice ID is required" };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
        message: "Invoice has been deleted.",
        data: { id }
    };
}
