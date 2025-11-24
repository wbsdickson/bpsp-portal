'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser } = useAppStore();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/merchant');
      }
    }
  }, [currentUser, router]);

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">BPSP Portal</CardTitle>
          <CardDescription>Select a role to simulate login</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => handleLogin('merchant')}
          >
            Login as Merchant / 販売者としてログイン
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => handleLogin('admin')}
          >
            Login as Admin / 管理者としてログイン
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
