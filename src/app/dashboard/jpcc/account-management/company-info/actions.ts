"use server";

import { z } from "zod";

const updateCompanySchema = z.object({
    merchantId: z.string(),
    name: z.string().min(1, "Merchant Name is required"),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    invoiceEmail: z.string().email("Invalid email address"),
    websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    invoicePrefix: z.string().optional(),
    enableCreditPayment: z.boolean().optional(),
});

export type UpdateCompanyState = {
    success?: boolean;
    message?: string;
    errors?: {
        name?: string[];
        address?: string[];
        phoneNumber?: string[];
        invoiceEmail?: string[];
        websiteUrl?: string[];
        invoicePrefix?: string[];
        enableCreditPayment?: string[];
    };
};

export async function updateCompanyInfo(
    prevState: UpdateCompanyState,
    formData: FormData
): Promise<UpdateCompanyState> {
    const rawData = {
        merchantId: formData.get("merchantId"),
        name: formData.get("name"),
        address: formData.get("address"),
        phoneNumber: formData.get("phoneNumber"),
        invoiceEmail: formData.get("invoiceEmail"),
        websiteUrl: formData.get("websiteUrl"),
        invoicePrefix: formData.get("invoicePrefix") || undefined,
        enableCreditPayment: formData.get("enableCreditPayment") === "on",
    };

    const validatedFields = updateCompanySchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { merchantId, name, address, phoneNumber, invoiceEmail, websiteUrl, invoicePrefix, enableCreditPayment } = validatedFields.data;

    // Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate DB Update
    console.log(`Updating merchant ${merchantId}:`, {
        name,
        address,
        phoneNumber,
        invoiceEmail,
        websiteUrl,
        invoicePrefix,
        enableCreditPayment
    });

    return {
        success: true,
        message: "Company information has been updated.", // 自社情報を更新しました。
    };
}
