"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function RegisterCompletePage() {
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
                        <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Registration Complete</CardTitle>
                    <CardDescription>
                        Your account has been successfully created.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        You can now log in to the portal using your email and password.
                    </p>

                    <div className="pt-4">
                        <Button asChild className="w-full">
                            <Link href="/login">Proceed to Login</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
