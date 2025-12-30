"use client";

import * as React from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import UserDetail from "../_components/user-detail";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const locale = useLocale();

  if (!id) {
    return (
      <HeaderPage title={"User"}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">User not found.</div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/operator/accounts`}>Back</Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <HeaderPage title={id}>
      <UserDetail userId={id} />
    </HeaderPage>
  );
}
