"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateTaxSettings } from "./actions";

const taxSettingsFormSchema = z.object({
    defaultTaxId: z.string().min(1, "Tax selection is required"),
    invoicePrefix: z.string().max(50, "Prefix must be 50 characters or less").optional(),
    enableCreditPayment: z.boolean(),
});

type TaxSettingsFormValues = z.infer<typeof taxSettingsFormSchema>;

export function TaxSettingsForm() {
    const { currentUser, getCurrentMerchant, updateMerchant, taxes } = useAppStore();
    const [isPending, setIsPending] = useState(false);
    const merchant = getCurrentMerchant();

    // Access Control: Only owner can edit.
    const canEdit = currentUser?.memberRole === 'owner' || currentUser?.role === 'merchant';

    const form = useForm<TaxSettingsFormValues>({
        resolver: zodResolver(taxSettingsFormSchema),
        defaultValues: {
            defaultTaxId: "",
            invoicePrefix: "",
            enableCreditPayment: false,
        },
    });

    useEffect(() => {
        if (merchant) {
            form.reset({
                defaultTaxId: merchant.defaultTaxId || "",
                invoicePrefix: merchant.invoicePrefix || "",
                enableCreditPayment: merchant.enableCreditPayment,
            });
        }
    }, [merchant, form]);

    async function onSubmit(data: TaxSettingsFormValues) {
        if (!merchant) return;

        setIsPending(true);
        const formData = new FormData();
        formData.append("defaultTaxId", data.defaultTaxId);
        formData.append("invoicePrefix", data.invoicePrefix || "");
        if (data.enableCreditPayment) {
            formData.append("enableCreditPayment", "on");
        }

        try {
            const result = await updateTaxSettings({}, formData);

            if (result.success) {
                toast.success(result.message);
                updateMerchant(merchant.id, {
                    defaultTaxId: data.defaultTaxId,
                    invoicePrefix: data.invoicePrefix,
                    enableCreditPayment: data.enableCreditPayment,
                    updatedBy: currentUser?.name,
                });
            } else {
                toast.error(result.message || "Failed to update settings");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    if (!merchant) return null;

    if (!canEdit) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                You do not have permission to view or edit these settings.
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tax & Payment Settings</CardTitle>
                        <CardDescription>
                            Configure your default tax rate, invoice numbering, and payment methods.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="defaultTaxId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Consumption Tax</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a tax rate" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {taxes.map((tax) => (
                                                <SelectItem key={tax.id} value={tax.id}>
                                                    {tax.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        This tax rate will be applied by default to new invoice items.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="invoicePrefix"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Number Prefix</FormLabel>
                                    <FormControl>
                                        <Input placeholder="INV-" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Optional prefix for your invoice numbers (max 50 characters).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="enableCreditPayment"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Enable Credit Payment
                                        </FormLabel>
                                        <FormDescription>
                                            Allow customers to pay invoices using credit cards.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
