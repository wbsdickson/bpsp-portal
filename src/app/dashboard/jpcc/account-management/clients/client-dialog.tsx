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
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { Client } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createClient, updateClient } from "./actions";

const clientFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client?: Client | null; // If provided, it's edit mode
    merchantId: string;
}

export function ClientDialog({ open, onOpenChange, client, merchantId }: ClientDialogProps) {
    const { addClient, updateClient: updateClientStore } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            address: "",
        },
    });

    useEffect(() => {
        if (client) {
            form.reset({
                name: client.name,
                email: client.email,
                phoneNumber: client.phoneNumber,
                address: client.address || "",
            });
        } else {
            form.reset({
                name: "",
                email: "",
                phoneNumber: "",
                address: "",
            });
        }
    }, [client, form, open]);

    async function onSubmit(data: ClientFormValues) {
        setIsPending(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        if (data.address) formData.append("address", data.address);

        if (client) {
            formData.append("id", client.id);
        }

        try {
            const action = client ? updateClient : createClient;
            const result = await action({}, formData);

            if (result.success && result.data) {
                toast.success(result.message);
                if (client) {
                    updateClientStore(client.id, {
                        name: data.name,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                    });
                } else {
                    addClient({
                        id: result.data.id,
                        merchantId: merchantId,
                        name: data.name,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
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
                    <DialogTitle>{client ? "Edit Client" : "Add Client"}</DialogTitle>
                    <DialogDescription>
                        {client
                            ? "Update client details here."
                            : "Register a new client for your business."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Corp" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="contact@acme.com" {...field} />
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
                                        <Input placeholder="555-1234" {...field} />
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
                                    <FormLabel>Address (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="123 Business Rd..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
