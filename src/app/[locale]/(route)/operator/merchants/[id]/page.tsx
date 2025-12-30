"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import MerchantDetail from "../_components/merchant-detail";

export default function MerchantDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

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
    <HeaderPage title={id}>
      <MerchantDetail merchantId={id} />
    </HeaderPage>
  );
}
