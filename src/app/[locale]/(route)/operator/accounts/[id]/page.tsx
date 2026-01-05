"use client";

import * as React from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import UserDetail from "../_components/user-detail";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { useBasePath } from "@/hooks/use-base-path";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const locale = useLocale();

  const { basePath } = useBasePath();

  if (!id) {
    return (
      <HeaderPage title={"User"}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">User not found.</div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${basePath}`}>Back</Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <div className="mx-auto w-[1280px] space-y-4">
      <PageBreadcrumb
        items={[
          { label: "Accounts", href: basePath },
          { label: id, active: true },
        ]}
      />
      <div className="">
        <UserDetail userId={id} />
      </div>
    </div>
  );
}
