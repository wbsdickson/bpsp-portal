'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { requestPasswordReset } from './actions';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

/**
 * Function ID: MERCHANT_002a
 * Function Name: Password Reset (Send Email)
 * Category: Screen Function (SSR)
 * Objective: Allow merchant users who have forgotten their password to receive a password-reset URL sent to their registered email address.
 */

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: '有効なメールアドレスを入力してください。' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { currentUser } = useAppStore();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Access Control: Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'admin' || currentUser.role === 'jpcc_admin') {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard/merchant');
            }
        }
    }, [currentUser, router]);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(data: ForgotPasswordFormValues) {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('email', data.email);

        try {
            const result = await requestPasswordReset(formData);

            if (result.success) {
                setIsSubmitted(true);
                toast.success('メールを送信しました');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('予期せぬエラーが発生しました。');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="relative flex min-h-screen items-center justify-center">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url(/login_bg.png)",
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <Card className="relative z-10 w-[400px] shadow-2xl backdrop-blur-sm bg-background/95 border-2">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-green-100 p-3">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-xl">Email Sent</CardTitle>
                        <CardDescription>
                            パスワード再発行メールを送信しました。
                            <br />
                            メール内のリンクからパスワードの再設定を行ってください。
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button variant="link" asChild>
                            <Link href="/login">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url(/login_bg.png)",
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <Card className="relative z-10 w-[400px] shadow-2xl backdrop-blur-sm bg-background/95 border-2">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <Image
                            src="/JPCC/logo-fullname-horizontal.png"
                            alt="JPCC Portal"
                            width={260}
                            height={80}
                            className="h-auto"
                            priority
                        />
                    </div>
                    <CardTitle className="text-xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
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
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                                style={{ backgroundColor: "#145DB4" }}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>

                            <div className="text-center">
                                <Button variant="link" asChild className="text-sm text-muted-foreground">
                                    <Link href="/login">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
