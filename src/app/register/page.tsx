"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export default function RegisterPage() {
    const router = useRouter();
    const { createMerchantSignup, users } = useAppStore();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Check if email already exists
        const existingUser = users.find(u => u.email === values.email);
        if (existingUser) {
            setError("This email address is already registered.");
            return;
        }

        const token = createMerchantSignup(values.email);
        console.log("Registration Token:", token); // For debugging/demo purposes
        router.push(`/register/sent?email=${encodeURIComponent(values.email)}&token=${token}`);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url(/login_bg.png)",
                }}
            >
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-black/40" />
            </div>
            <Card className="w-full max-w-md relative z-10">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit" className="w-full">
                                Send Registration Link
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
