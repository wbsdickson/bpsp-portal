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
      if (currentUser.role === 'admin' || currentUser.role === 'jpcc_admin') {
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
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => handleLogin('jpcc_admin')}
          >
            Login as JPCC Admin / 管理者としてログイン
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Merchants</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => handleLogin('merchant')}
          >
            Merchant / 販売者 (BPSP Only)としてログイン
          </Button>
          <Button
            size="lg"
            className="w-full bg-teal-600 hover:bg-teal-700"
            onClick={() => handleLogin('merchant_jpcc')}
          >
            Merchant / 販売者 (JPCC + BPSP)としてログイン
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
