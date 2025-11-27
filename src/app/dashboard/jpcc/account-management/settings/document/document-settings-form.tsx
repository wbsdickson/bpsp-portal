"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateDocumentSettingsAction } from "./actions";

const documentSettingsSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    representativeName: z.string().optional(),
    footerText: z.string().max(1000, "Footer text must be less than 1000 characters").optional(),
});

type DocumentSettingsFormValues = z.infer<typeof documentSettingsSchema>;

export function DocumentSettingsForm() {
    const { currentUser, getDocumentSettings, updateDocumentSettings } = useAppStore();
    const [isPending, setIsPending] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Access Control: Only owner can edit
    const isOwner = currentUser?.memberRole === 'owner';

    const merchantId = currentUser?.merchantId;
    const settings = merchantId ? getDocumentSettings(merchantId) : undefined;

    const form = useForm<DocumentSettingsFormValues>({
        resolver: zodResolver(documentSettingsSchema),
        defaultValues: {
            companyName: "",
            address: "",
            phoneNumber: "",
            representativeName: "",
            footerText: "",
        },
    });

    useEffect(() => {
        if (settings) {
            form.reset({
                companyName: settings.companyName,
                address: settings.address || "",
                phoneNumber: settings.phoneNumber || "",
                representativeName: settings.representativeName || "",
                footerText: settings.footerText || "",
            });
        } else if (currentUser?.companyName) {
            // Default to merchant name if no settings exist
            form.setValue("companyName", currentUser.companyName);
        }
    }, [settings, currentUser, form]);

    async function onSubmit(data: DocumentSettingsFormValues) {
        if (!merchantId) return;

        setIsPending(true);
        const formData = new FormData();
        formData.append("companyName", data.companyName);
        if (data.address) formData.append("address", data.address);
        if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
        if (data.representativeName) formData.append("representativeName", data.representativeName);
        if (data.footerText) formData.append("footerText", data.footerText);
        if (logoFile) formData.append("logo", logoFile);

        try {
            const result = await updateDocumentSettingsAction({}, formData);

            if (result.success && result.data) {
                toast.success(result.message);
                updateDocumentSettings(merchantId, {
                    ...data,
                    logoUrl: result.data.logoUrl || settings?.logoUrl,
                    updatedBy: currentUser?.id,
                    updatedAt: result.data.updatedAt,
                });
            } else {
                toast.error(result.message || "Failed to update settings");
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

    if (!isOwner) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Document Settings</CardTitle>
                    <CardDescription>
                        You do not have permission to edit document settings. Only the account owner can make changes.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Document Settings</CardTitle>
                <CardDescription>
                    Manage the information printed on your invoices, quotations, and receipts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name (Print Name) <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="TechCorp Solutions" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This name will appear on all issued documents.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 Tech Blvd, San Francisco, CA" {...field} />
                                        </FormControl>
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
                                            <Input placeholder="555-0101" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="representativeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Representative Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Alice Merchant" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Logo Image</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload a PNG or JPG image. This will be displayed on the top of your documents.
                            </FormDescription>
                            {settings?.logoUrl && !logoFile && (
                                <div className="mt-2">
                                    <p className="text-sm text-muted-foreground mb-1">Current Logo:</p>
                                    <img src={settings.logoUrl} alt="Current Logo" className="h-12 object-contain border rounded p-1" />
                                </div>
                            )}
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="footerText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Footer Text</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Thank you for your business! Please pay within 30 days."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Text to appear at the bottom of documents (max 1000 characters).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
