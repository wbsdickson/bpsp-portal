"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateAccountInfo } from "./actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const accountFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.password && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function UserProfileForm() {
    const { currentUser, updateUser } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (currentUser) {
            form.reset({
                name: currentUser.name,
                email: currentUser.email,
                password: "",
                confirmPassword: "",
            });
        }
    }, [currentUser, form]);

    async function onSubmit(data: AccountFormValues) {
        if (!currentUser) return;

        setIsPending(true);
        const formData = new FormData();
        formData.append("userId", currentUser.id);
        formData.append("name", data.name);
        formData.append("email", data.email);
        if (data.password) {
            formData.append("password", data.password);
            formData.append("confirmPassword", data.confirmPassword || "");
        }

        try {
            const result = await updateAccountInfo({}, formData);

            if (result.success) {
                toast.success(result.message);
                updateUser(currentUser.id, {
                    name: data.name,
                    email: data.email,
                });
                form.reset({
                    name: data.name,
                    email: data.email,
                    password: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(result.message || "Failed to update account");
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

    if (!currentUser) return null;

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
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
                                        <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your email" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            A confirmation email will be sent if you change your email address.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your password. Leave blank to keep current password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="New password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm new password" {...field} />
                                        </FormControl>
                                        <FormMessage />
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

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                            <span>Email Notifications</span>
                            <span className="font-normal text-xs text-muted-foreground">Receive emails about your account activity.</span>
                        </Label>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="payment-alerts" className="flex flex-col space-y-1">
                            <span>Payment Alerts</span>
                            <span className="font-normal text-xs text-muted-foreground">Get notified when a payment is processed.</span>
                        </Label>
                        <Switch id="payment-alerts" defaultChecked />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
