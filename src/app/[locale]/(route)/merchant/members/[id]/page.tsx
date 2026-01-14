"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import MerchantMemberDetail from "../_components/merchant-member-detail";

export default function MerchantMemberDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const t = useTranslations("Merchant.MerchantMembers");

  const locale = useLocale();

  if (!id) {
    return (
      <HeaderPage title={t("detailTitle")}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">{t("memberNotFound")}</div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/merchant/members`}>{t("back")}</Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <HeaderPage title={t("detailTitle")}>
      <MerchantMemberDetail userId={id} />
    </HeaderPage>
  );
}
