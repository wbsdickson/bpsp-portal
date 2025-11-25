"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
          <CardDescription>Select a role to simulate login</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            size="lg"
            className="w-full text-white"
            style={{
              backgroundColor: "#145DB4",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1155A0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#145DB4";
            }}
            onClick={() => handleLogin("jpcc_admin")}
          >
            JPCC Admin
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
            Merchant (BPSP)
          </Button>
          <Button
            size="lg"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => handleLogin("merchant_jpcc")}
          >
            Merchant (JPCC + BPSP)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
