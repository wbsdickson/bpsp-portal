"use server";

import { z } from "zod";

const documentSettingsSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    representativeName: z.string().optional(),
    footerText: z.string().max(1000, "Footer text must be less than 1000 characters").optional(),
});

export async function updateDocumentSettingsAction(prevState: any, formData: FormData) {
    const validatedFields = documentSettingsSchema.safeParse({
        companyName: formData.get("companyName"),
        address: formData.get("address"),
        phoneNumber: formData.get("phoneNumber"),
        representativeName: formData.get("representativeName"),
        footerText: formData.get("footerText"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    const logoFile = formData.get("logo") as File | null;
    let logoUrl = undefined;

    if (logoFile && logoFile.size > 0) {
        // Validate file type
        if (!['image/jpeg', 'image/png'].includes(logoFile.type)) {
            return {
                success: false,
                message: "Invalid image format. Only JPG and PNG are allowed.",
            };
        }
        // Mock upload
        logoUrl = `https://fake-storage.com/${logoFile.name}`;
    }

    // Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Document settings have been updated.",
        data: {
            ...validatedFields.data,
            logoUrl,
            updatedAt: new Date().toISOString(),
        }
    };
}
