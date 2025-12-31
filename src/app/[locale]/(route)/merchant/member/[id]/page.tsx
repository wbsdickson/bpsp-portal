"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import MerchantMemberDetail from "../_components/merchant-member-detail";

export default function MerchantMemberDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const locale = useLocale();

  if (!id) {
    return (
      <HeaderPage title={"Member"}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">Member not found.</div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/merchant/member`}>Back</Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <HeaderPage title={id}>
      <MerchantMemberDetail userId={id} />
    </HeaderPage>
  );
}
