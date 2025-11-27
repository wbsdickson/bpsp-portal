"use server";

import { z } from "zod";
import { MemberRole } from "@/lib/types";

const memberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["owner", "staff", "viewer"] as [string, ...string[]]),
});

export async function createMember(prevState: any, formData: FormData) {
    const validatedFields = memberSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
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

    // In a real app, we would check for duplicates in DB here
    // For now, we'll assume success and let the client store handle the update
    // But we can simulate a duplicate check if we had access to the store (which we don't on server)

    return {
        success: true,
        message: "Member added successfully",
        data: {
            ...validatedFields.data,
            id: `u_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
        }
    };
}

export async function updateMember(prevState: any, formData: FormData) {
    const id = formData.get("id");
    const validatedFields = memberSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
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
        message: "Member updated successfully",
        data: {
            id,
            ...validatedFields.data,
        }
    };
}

export async function deleteMemberAction(prevState: any, formData: FormData) {
    const id = formData.get("id");

    if (!id) {
        return { success: false, message: "Member ID is required" };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
        message: "Member deleted successfully",
        data: { id }
    };
}
