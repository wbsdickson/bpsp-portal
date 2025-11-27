"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";

export default function RegisterSentPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token"); // Only for demo purposes

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
            <Card className="w-full max-w-md relative z-10 text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                    <CardDescription>
                        We have sent a registration link to <span className="font-medium text-foreground">{email}</span>.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Click the link in the email to complete your registration.
                    </p>

                    {/* DEMO ONLY: Show the link directly */}
                    {token && (
                        <div className="mt-6 p-4 bg-muted rounded-lg text-left">
                            <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Demo Only: Registration Link</p>
                            <Link href={`/register/${token}`} className="text-sm text-primary break-all hover:underline">
                                /register/{token}
                            </Link>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/login">Back to Login</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
