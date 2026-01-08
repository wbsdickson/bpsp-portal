"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createDeliveryNoteAction, updateDeliveryNoteAction } from "./actions";
import { useAppStore } from "@/lib/store";
import { DeliveryNote } from "@/lib/types";

const deliveryNoteItemSchema = z.object({
    itemId: z.string().optional(),
    name: z.string().min(1, "Item name is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.coerce.number().min(0, "Unit price must be non-negative"),
    taxId: z.string().min(1, "Tax category is required"),
});

const formSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    deliveryDate: z.date({
    }),
    items: z.array(deliveryNoteItemSchema).min(1, "At least one item is required"),
    notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DeliveryNoteFormProps {
    merchantId: string;
    initialData?: DeliveryNote;
}

export function DeliveryNoteForm({ merchantId, initialData }: DeliveryNoteFormProps) {
    const router = useRouter();
    const { getMerchantClients, getMerchantItems, taxes, addDeliveryNote, updateDeliveryNote } = useAppStore();
    const clients = getMerchantClients(merchantId);
    const merchantItems = getMerchantItems(merchantId);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            clientId: initialData?.clientId || "",
            deliveryDate: initialData?.deliveryDate ? new Date(initialData.deliveryDate) : new Date(),
            items: initialData?.items.map(item => ({
                itemId: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxId: item.taxId || "standard",
            })) || [
                    { name: "", quantity: 1, unitPrice: 0, taxId: "standard" }
                ],
            notes: initialData?.notes || "",
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

    const calculateTotal = (items: FormValues["items"]) => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const watchedItems = form.watch("items");
    const totalAmount = calculateTotal(watchedItems);

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            if (initialData?.id) {
                formData.append("id", initialData.id);
            }
            formData.append("clientId", data.clientId);
            formData.append("deliveryDate", data.deliveryDate.toISOString());
            formData.append("notes", data.notes || "");
            formData.append("items", JSON.stringify(data.items));

            const action = initialData ? updateDeliveryNoteAction : createDeliveryNoteAction;
            const result = await action(null, formData);

            if (result.success && result.data) {
                if (initialData) {
                    updateDeliveryNote(result.data.id, result.data as DeliveryNote);
                    toast.success("Delivery Note updated successfully");
                } else {
                    addDeliveryNote({
                        ...(result.data as DeliveryNote),
                        merchantId
                    });
                    toast.success("Delivery Note created successfully");
                }
                router.push("/dashboard/merchant/delivery-notes");
            } else {
                toast.error(result.message || "Something went wrong");
                if (result.errors) {
                    Object.entries(result.errors).forEach(([key, messages]) => {
                        if (messages && messages.length > 0) {
                            form.setError(key as any, { message: messages[0] });
                        }
                    });
                }
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client <span className="text-destructive">*</span></FormLabel>
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
                                name="deliveryDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Delivery Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Add any delivery instructions or notes here..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Line Items</h3>
                        <Button
                            
                            variant="outline"
                            size="sm"
                            onClick={() => append({ name: "", quantity: 1, unitPrice: 0, taxId: taxes[0]?.id || "standard" })}
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
                                                <FormLabel className="text-xs">Item Name <span className="text-destructive">*</span></FormLabel>
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
                        Total: ${totalAmount.toLocaleString()}
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        
                        variant="outline"
                        onClick={() => router.push("/dashboard/merchant/delivery-notes")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : (initialData ? "Update Delivery Note" : "Create Delivery Note")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
