"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function RegisterCompletePage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const safeCallbackUrl = callbackUrl
    ? callbackUrl.replace(/^\/+/, "").replace(/^https?:\/\//, "")
    : null;
  const nextHref = safeCallbackUrl
    ? `/${locale}/${safeCallbackUrl}`
    : `/${locale}/signin`;

  return (
    <Card className="bg-sidebar w-full border-0 shadow-2xl backdrop-blur">
      <CardHeader>
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          Registration Complete
        </CardTitle>
        <CardDescription>
          Your account has been successfully created.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          You can now log in to the portal using your email and password.
        </p>

        <div className="pt-4">
          <Button asChild className="w-full">
            <Link href={nextHref}>Proceed</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
