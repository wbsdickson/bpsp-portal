'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import { authenticateUser } from './actions';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Function ID: MERCHANT_001
 * Function Name: Login
 * Category: Screen Function (SSR)
 * Objective: Allow merchant users to log in to the system by entering their email address and password.
 */
const loginSchema = z.object({
    email: z.string().email({ message: '有効なメールアドレスを入力してください。' }),
    password: z.string().min(1, { message: 'パスワードを入力してください。' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { loginAsUser, currentUser } = useAppStore();
    const [serverError, setServerError] = useState<string | null>(null);
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

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true);
        setServerError(null);

        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);

        try {
            const result = await authenticateUser(formData);

            if (result.success) {
                // Store user information in session (store)
                loginAsUser(result.user.id);
                toast.success('ログインしました');
                // Redirect is handled by useEffect or we can do it here
                if (result.user.role === 'admin' || result.user.role === 'jpcc_admin') {
                    router.push('/dashboard/admin');
                } else {
                    router.push('/dashboard/merchant');
                }
            } else {
                setServerError(result.error);
                toast.error(result.error);
            }
        } catch (error) {
            setServerError('予期せぬエラーが発生しました。');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Login Card */}
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
                    <CardTitle className="text-xl">Merchant Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to access your dashboard.
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            {serverError && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                    {serverError}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                                style={{ backgroundColor: "#145DB4" }}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>

                            <div className="mt-4 text-center text-xs text-muted-foreground space-y-2">
                                <p className="font-semibold">Test Credentials (Password: password123)</p>
                                <div className="grid grid-cols-1 gap-1 text-left pl-8">
                                    <div>
                                        <span className="font-medium">Merchant (BPSP Only):</span>
                                        <br />alice@techcorp.com
                                    </div>
                                    <div>
                                        <span className="font-medium">Merchant (JPCC + BPSP):</span>
                                        <br />eve@hybrid.com
                                    </div>
                                    <div>
                                        <span className="font-medium">JPCC Admin:</span>
                                        <br />david@jpcc.com
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
