"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateCompanyInfo } from "./company-info/actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const companyFormSchema = z.object({
    name: z.string().min(1, "Merchant Name is required"),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    invoiceEmail: z.string().email("Invalid email address"),
    websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

// Mock Prefectures
const PREFECTURES = [
    "Tokyo", "Osaka", "Kyoto", "Kanagawa", "Saitama", "Chiba", "Aichi", "Hokkaido", "Fukuoka"
];

export function CompanyInfoForm() {
    const { currentUser, getCurrentMerchant, updateMerchant } = useAppStore();
    const [isPending, setIsPending] = useState(false);
    const merchant = getCurrentMerchant();

    // Access Control: Owner or Staff can edit. Viewer cannot.
    // For mock purposes, let's assume 'merchant_jpcc' role is owner/staff.
    // If we had granular permissions, we'd check them here.
    const canEdit = true; // Simplified for this demo

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            name: "",
            address: "",
            phoneNumber: "",
            invoiceEmail: "",
            websiteUrl: "",
        },
    });

    useEffect(() => {
        if (merchant) {
            form.reset({
                name: merchant.name,
                address: merchant.address || "",
                phoneNumber: merchant.phoneNumber || "",
                invoiceEmail: merchant.invoiceEmail,
                websiteUrl: merchant.websiteUrl || "",
            });
        }
    }, [merchant, form]);

    async function onSubmit(data: CompanyFormValues) {
        if (!merchant) return;

        setIsPending(true);
        const formData = new FormData();
        formData.append("merchantId", merchant.id);
        formData.append("name", data.name);
        formData.append("address", data.address || "");
        formData.append("phoneNumber", data.phoneNumber || "");
        formData.append("invoiceEmail", data.invoiceEmail);
        formData.append("websiteUrl", data.websiteUrl || "");

        try {
            const result = await updateCompanyInfo({}, formData);

            if (result.success) {
                toast.success(result.message);
                updateMerchant(merchant.id, {
                    name: data.name,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    invoiceEmail: data.invoiceEmail,
                    websiteUrl: data.websiteUrl,
                    updatedBy: currentUser?.name,
                });
            } else {
                toast.error(result.message || "Failed to update company info");
                if (result.errors) {
                    Object.entries(result.errors).forEach(([key, messages]) => {
                        if (messages && messages.length > 0) {
                            form.setError(key as any, { message: messages[0] });
                        }
                    });
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    if (!merchant) {
        return <div>No merchant profile found.</div>;
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Details</CardTitle>
                            <CardDescription>Manage your company's public profile and settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Merchant Name <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Company Name" {...field} disabled={!canEdit} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 Business St, City, Prefecture" {...field} disabled={!canEdit} />
                                        </FormControl>
                                        <FormDescription>Include postal code, prefecture, city, and street address.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="03-1234-5678" {...field} disabled={!canEdit} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="invoiceEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Invoice Email <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="billing@company.com" {...field} disabled={!canEdit} />
                                        </FormControl>
                                        <FormDescription>Email address used for receiving invoices.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="websiteUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://company.com" {...field} disabled={!canEdit} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        {canEdit && (
                            <CardFooter className="flex justify-end border-t px-6 py-4">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </form>
            </Form>
        </div>
    );
}
