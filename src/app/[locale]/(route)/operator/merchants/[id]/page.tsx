"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import MerchantDetail from "../_components/merchant-detail";
import { useBasePath } from "@/hooks/use-base-path";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { useTranslations } from "next-intl";

export default function MerchantDetailPage() {
  const t = useTranslations("Operator.Merchants");

  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { basePath } = useBasePath();

  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];

  const locale = useLocale();

  if (!id) {
    return (
      <HeaderPage title={"Merchant"}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Merchant not found.
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/operator/merchants`}>Back</Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <div className="mx-auto w-[1280px] space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <MerchantDetail merchantId={id} />
    </div>
  );
}
