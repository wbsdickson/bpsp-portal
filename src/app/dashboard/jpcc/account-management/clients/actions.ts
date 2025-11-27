"use server";

import { z } from "zod";

const clientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().optional(),
});

export async function createClient(prevState: any, formData: FormData) {
    const validatedFields = clientSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
        address: formData.get("address"),
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

    // In a real app, we would check for duplicates (Name + Email) here

    return {
        success: true,
        message: "Client registered successfully",
        data: {
            ...validatedFields.data,
            id: `c_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
        }
    };
}

export async function updateClient(prevState: any, formData: FormData) {
    const id = formData.get("id");
    const validatedFields = clientSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
        address: formData.get("address"),
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
        message: "Client information updated successfully",
        data: {
            id,
            ...validatedFields.data,
        }
    };
}

export async function deleteClientAction(prevState: any, formData: FormData) {
    const id = formData.get("id");

    if (!id) {
        return { success: false, message: "Client ID is required" };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
        message: "Client deleted successfully",
        data: { id }
    };
}
