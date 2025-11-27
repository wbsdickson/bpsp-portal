"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { useAppStore } from "@/lib/store";
import { Item } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createItem, updateItemAction } from "./actions";

const itemFormSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    unitPrice: z.string().optional(),
    taxId: z.string().min(1, "Tax category is required"),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

interface ItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: Item | null; // If provided, it's edit mode
    merchantId: string;
}

export function ItemDialog({ open, onOpenChange, item, merchantId }: ItemDialogProps) {
    const { addItem, updateItem, taxes } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<ItemFormValues>({
        resolver: zodResolver(itemFormSchema),
        defaultValues: {
            name: "",
            unitPrice: "",
            taxId: "",
        },
    });

    useEffect(() => {
        if (item) {
            form.reset({
                name: item.name,
                unitPrice: item.unitPrice?.toString() || "",
                taxId: item.taxId,
            });
        } else {
            form.reset({
                name: "",
                unitPrice: "",
                taxId: "",
            });
        }
    }, [item, form, open]);

    async function onSubmit(data: ItemFormValues) {
        setIsPending(true);
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.unitPrice) formData.append("unitPrice", data.unitPrice);
        formData.append("taxId", data.taxId);

        if (item) {
            formData.append("id", item.id);
        }

        try {
            const action = item ? updateItemAction : createItem;
            const result = await action({}, formData);

            if (result.success && result.data) {
                toast.success(result.message);
                if (item) {
                    updateItem(item.id, {
                        name: data.name,
                        unitPrice: data.unitPrice ? Number(data.unitPrice) : undefined,
                        taxId: data.taxId,
                    });
                } else {
                    addItem({
                        id: result.data.id,
                        merchantId: merchantId,
                        name: data.name,
                        unitPrice: data.unitPrice ? Number(data.unitPrice) : undefined,
                        taxId: data.taxId,
                        createdAt: (result.data as any).createdAt,
                    } as any);
                }
                onOpenChange(false);
            } else {
                toast.error(result.message || "Operation failed");
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Item" : "Register Item"}</DialogTitle>
                    <DialogDescription>
                        {item
                            ? "Update item details here."
                            : "Register a new item for invoices and orders."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Web Hosting" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unitPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="1000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taxId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Category <span className="text-red-500">*</span></FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select tax category" />
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
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Register"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
