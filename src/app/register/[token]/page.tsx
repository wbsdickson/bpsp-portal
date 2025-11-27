"use client";

import { useEffect, useState } from "react";
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
import { useRouter, useParams } from "next/navigation";
import { MerchantSignup } from "@/lib/types";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
    merchantName: z.string().min(2, "Merchant name must be at least 2 characters."),
    phoneNumber: z.string().min(10, "Please enter a valid phone number."),
    address: z.string().min(5, "Address is required."),
    ownerName: z.string().min(2, "Owner name is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function CompleteRegistrationPage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;
    const { validateSignupToken, completeMerchantRegistration } = useAppStore();

    const [isValidating, setIsValidating] = useState(true);
    const [signupData, setSignupData] = useState<MerchantSignup | null>(null);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            merchantName: "",
            phoneNumber: "",
            address: "",
            ownerName: "",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        const signup = validateSignupToken(token);
        if (signup) {
            setSignupData(signup);
        } else {
            setError("The registration link is invalid or has expired.");
        }
        setIsValidating(false);
    }, [token, validateSignupToken]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!signupData) return;

        completeMerchantRegistration(
            token,
            {
                name: values.merchantName,
                phoneNumber: values.phoneNumber,
                address: values.address,
            },
            {
                name: values.ownerName,
                // Password would be hashed in a real app
            }
        );

        router.push("/register/complete");
    }

    if (isValidating) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Invalid Link
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button onClick={() => router.push("/register")} className="w-full">
                            Start Over
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
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
            <Card className="w-full max-w-lg relative z-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Complete Registration</CardTitle>
                    <CardDescription>
                        Finish setting up your account for {signupData?.email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Company Information</h3>
                                <FormField
                                    control={form.control}
                                    name="merchantName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Acme Corp" {...field} />
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
                                                <Input placeholder="03-1234-5678" {...field} />
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
                                                <Input placeholder="1-2-3 Marunouchi, Chiyoda-ku, Tokyo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account Information</h3>
                                <FormField
                                    control={form.control}
                                    name="ownerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
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
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full mt-6">
                                Complete Registration
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
