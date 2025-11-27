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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useAppStore } from "@/lib/store";
import { Invoice } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import { createInvoiceAction, updateInvoiceAction } from "./actions";
import { useRouter } from "next/navigation";

const invoiceItemSchema = z.object({
    itemId: z.string().optional(),
    name: z.string().min(1, "Item name is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.coerce.number().min(0, "Unit price must be non-negative"),
    taxId: z.string().min(1, "Tax category is required"),
});

const invoiceFormSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    invoiceDate: z.string().min(1, "Invoice date is required"),
    dueDate: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    status: z.enum(['draft', 'pending']),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
    invoice?: Invoice;
    merchantId: string;
}

export function InvoiceForm({ invoice, merchantId }: InvoiceFormProps) {
    const router = useRouter();
    const { getMerchantClients, getMerchantItems, taxes, addInvoice, updateInvoice } = useAppStore();
    const clients = getMerchantClients(merchantId);
    const merchantItems = getMerchantItems(merchantId);
    const [isPending, setIsPending] = useState(false);

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceFormSchema) as any,
        defaultValues: {
            clientId: invoice?.clientId || "",
            invoiceDate: invoice?.invoiceDate || new Date().toISOString().split('T')[0],
            dueDate: invoice?.dueDate || "",
            notes: invoice?.notes || "",
            items: invoice?.items.map(i => ({
                itemId: i.itemId,
                name: i.name,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                taxId: i.taxId,
            })) || [{ name: "", quantity: 1, unitPrice: 0, taxId: taxes[0]?.id || "" }],
            status: invoice?.status === 'pending' ? 'pending' : 'draft',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    // Handle item selection from master
    const handleItemSelect = (index: number, itemId: string) => {
        const selectedItem = merchantItems.find(i => i.id === itemId);
        if (selectedItem) {
            form.setValue(`items.${index}.name`, selectedItem.name);
            form.setValue(`items.${index}.unitPrice`, selectedItem.unitPrice || 0);
            form.setValue(`items.${index}.taxId`, selectedItem.taxId);
            form.setValue(`items.${index}.itemId`, itemId);
        }
    };

    async function onSubmit(data: InvoiceFormValues) {
        setIsPending(true);
        const formData = new FormData();
        if (invoice) formData.append("id", invoice.id);
        formData.append("clientId", data.clientId);
        formData.append("invoiceDate", data.invoiceDate);
        if (data.dueDate) formData.append("dueDate", data.dueDate);
        if (data.notes) formData.append("notes", data.notes);
        formData.append("status", data.status);
        formData.append("items", JSON.stringify(data.items));

        try {
            const action = invoice ? updateInvoiceAction : createInvoiceAction;
            const result = await action({}, formData);

            if (result.success && result.data) {
                toast.success(result.message);
                if (invoice) {
                    updateInvoice(invoice.id, result.data as Partial<Invoice>);
                } else {
                    addInvoice({
                        ...(result.data as any),
                        merchantId,
                    });
                }
                router.push("/dashboard/merchant/invoices");
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

    const calculateSubtotal = () => {
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

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="invoiceDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Date <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Items</h3>
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
                            <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
                                <div className="col-span-4">
                                    <FormLabel className={cn(index !== 0 && "sr-only")}>Item</FormLabel>
                                    <div className="space-y-2">
                                        <Select onValueChange={(val) => handleItemSelect(index, val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select from master" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {merchantItems.map((item) => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Item Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={cn(index !== 0 && "sr-only")}>Qty</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.unitPrice`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={cn(index !== 0 && "sr-only")}>Price</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.taxId`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={cn(index !== 0 && "sr-only")}>Tax</FormLabel>
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
                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end text-lg font-semibold">
                        Subtotal: ¥{calculateSubtotal().toLocaleString()}
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Payment terms, bank details, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="secondary"
                        onClick={() => form.setValue("status", "draft")}
                        disabled={isPending}
                    >
                        Save as Draft
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => form.setValue("status", "pending")}
                        disabled={isPending}
                    >
                        Issue Invoice
                    </Button>
                </div>
            </form>
        </Form>
    );
}
