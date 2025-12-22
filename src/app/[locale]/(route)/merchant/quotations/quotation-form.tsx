"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
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
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { Quotation, QuotationItem } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createQuotationAction, updateQuotationAction } from "./actions";

const quotationItemSchema = z.object({
    itemId: z.string().optional(),
    name: z.string().min(1, "Item name is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Unit price must be non-negative"),
    taxId: z.string().min(1, "Tax category is required"),
});

const quotationFormSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    quotationDate: z.string().min(1, "Quotation date is required"),
    items: z.array(quotationItemSchema).min(1, "At least one item is required"),
    notes: z.string().optional(),
});

type QuotationFormValues = z.infer<typeof quotationFormSchema>;

interface QuotationFormProps {
    quotation?: Quotation;
    merchantId: string;
}

export function QuotationForm({ quotation, merchantId }: QuotationFormProps) {
    const router = useRouter();
    const { getMerchantClients, getMerchantItems, taxes, addQuotation, updateQuotation } = useAppStore();
    const clients = getMerchantClients(merchantId);
    const merchantItems = getMerchantItems(merchantId);
    const [isPending, setIsPending] = useState(false);

    const form = useForm<QuotationFormValues>({
        resolver: zodResolver(quotationFormSchema),
        defaultValues: {
            clientId: quotation?.clientId || "",
            quotationDate: quotation?.quotationDate || new Date().toISOString().split('T')[0],
            items: quotation?.items.map(item => ({
                itemId: item.itemId || "",
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxId: item.taxId,
            })) || [
                    { name: "", quantity: 1, unitPrice: 0, taxId: taxes[0]?.id || "" }
                ],
            notes: quotation?.notes || "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const handleItemSelect = (index: number, itemId: string) => {
        const selectedItem = merchantItems.find(i => i.id === itemId);
        if (selectedItem) {
            form.setValue(`items.${index}.name`, selectedItem.name);
            form.setValue(`items.${index}.unitPrice`, selectedItem.unitPrice || 0);
            form.setValue(`items.${index}.taxId`, selectedItem.taxId);
            form.setValue(`items.${index}.itemId`, itemId);
        }
    };

    async function onSubmit(data: QuotationFormValues) {
        setIsPending(true);
        const formData = new FormData();
        if (quotation) formData.append("id", quotation.id);
        formData.append("clientId", data.clientId);
        formData.append("quotationDate", data.quotationDate);
        formData.append("items", JSON.stringify(data.items));
        if (data.notes) formData.append("notes", data.notes);

        try {
            const action = quotation ? updateQuotationAction : createQuotationAction;
            const result = await action({}, formData);

            if (result.success && result.data) {
                toast.success(result.message);
                if (quotation) {
                    updateQuotation(quotation.id, result.data as Partial<Quotation>);
                } else {
                    addQuotation({
                        ...result.data,
                        merchantId,
                    } as Quotation);
                }
                router.push("/dashboard/merchant/quotations");
            } else {
                toast.error(result.message || "Operation failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    const calculateTotal = () => {
        const items = form.watch("items");
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a client" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quotationDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quotation Date <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Line Items</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ name: "", quantity: 1, unitPrice: 0, taxId: taxes[0]?.id || "" })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>

                    <div className="border rounded-md p-4 space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-4 items-end border-b pb-4 last:border-0 last:pb-0">
                                <div className="col-span-12 md:col-span-3">
                                    <FormLabel className="text-xs">Select Item (Optional)</FormLabel>
                                    <Select onValueChange={(value) => handleItemSelect(index, value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {merchantItems.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-12 md:col-span-3">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Item Name <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-6 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Qty</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.value === "" ? 0 : e.target.valueAsNumber)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-6 md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.unitPrice`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.value === "" ? 0 : e.target.valueAsNumber)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-6 md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.taxId`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Tax</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Tax" />
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-6 md:col-span-1 flex justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end text-lg font-bold">
                        Total: ${calculateTotal().toLocaleString()}
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Additional notes..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : (quotation ? "Update Quotation" : "Create Quotation")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
