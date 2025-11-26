'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
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
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { resetPassword } from './actions';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

/**
 * Function ID: MERCHANT_002b
 * Function Name: Password Reset (Change Password)
 * Category: Screen Function (SSR)
 * Objective: Allow users to set a new password by accessing the URL sent in the password-reset email.
 */

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください。' }),
    confirmPassword: z.string().min(8, { message: 'パスワードは8文字以上で入力してください。' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { currentUser } = useAppStore();
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

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: ResetPasswordFormValues) {
        if (!token) {
            toast.error('再発行リンクが無効です。');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('token', token);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);

        try {
            const result = await resetPassword(formData);

            if (result.success) {
                toast.success(result.message);
                // Redirect to login after short delay
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
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

    if (!token) {
        return (
            <Card className="relative z-10 w-[400px] shadow-2xl backdrop-blur-sm bg-background/95 border-2">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-destructive">Invalid Link</CardTitle>
                    <CardDescription>
                        再発行リンクが無効です。もう一度最初からやり直してください。
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button variant="link" asChild>
                        <Link href="/forgot-password">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Request New Link
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
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
                <CardTitle className="text-xl">Reset Password</CardTitle>
                <CardDescription>
                    Enter your new password below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
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
                                        <Input type="password" placeholder="••••••••" {...field} />
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
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
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

            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </div>
    );
}
