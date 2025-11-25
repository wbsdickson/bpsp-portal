"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser } = useAppStore();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin" || currentUser.role === "jpcc_admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/merchant");
      }
    }
  }, [currentUser, router]);

  const handleLogin = (role: UserRole) => {
    login(role);
  };

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
          <CardTitle className="text-2xl font-bold text-primary">
            JPCC Portal
          </CardTitle>
          <CardDescription>Select a role to simulate login</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            size="lg"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white"
            onClick={() => handleLogin("jpcc_admin")}
          >
            JPCC Admin / 管理者としてログイン
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Merchants
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full text-white"
            style={{ backgroundColor: "oklch(0.4 0.15 150)" }}
            onClick={() => handleLogin("merchant")}
          >
            Merchant / 販売者 (BPSP Only)としてログイン
          </Button>
          <Button
            size="lg"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => handleLogin("merchant_jpcc")}
          >
            Merchant / 販売者 (JPCC + BPSP)としてログイン
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
