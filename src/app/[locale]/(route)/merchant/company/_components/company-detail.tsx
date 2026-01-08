"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useMerchantCompanyStore } from "@/store/merchant/merchant-company-store";

export default function MerchantCompanyDetail({
  companyId,
}: {
  companyId: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Merchant.CompanyInformationManagement");
  const router = useRouter();
  const company = useMerchantCompanyStore((s) => s.getCompanyById(companyId));

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            {t("messages.companyNotFound")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const createdAtLabel = company.createdAt
    ? (() => {
        const dt = new Date(company.createdAt);
        return Number.isNaN(dt.getTime())
          ? company.createdAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button
          
          variant="outline"
          className="h-9"
          onClick={() => {
            router.push(`/${locale}/merchant/company`);
          }}
        >
          {t("buttons.cancel")}
        </Button>
        <Button asChild className="h-9">
          <Link href={`/${locale}/merchant/company/${company.id}/edit`}>
            {t("actions.edit")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.name")}
              </div>
              <div className="font-medium">{company.name}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.address")}
              </div>
              <div className="font-medium">{company.address}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.email")}
              </div>
              <div className="font-medium">{company.invoiceEmail}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.role")}
              </div>
              <div className="font-medium">
                {company.enableCreditPayment ? "Yes" : "No"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.invoicePrefix")}
              </div>
              <div className="font-medium">{company.invoicePrefix}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.websiteUrl")}
              </div>
              <div className="font-medium">{company.websiteUrl}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.enableCreditPayment")}
              </div>
              <div className="font-medium">
                {company.enableCreditPayment ? "Yes" : "No"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.createdAt")}
              </div>
              <div className="font-medium">{createdAtLabel}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.status")}
              </div>
              <div className="font-medium">
                {company.enableCreditPayment ? (
                  <Badge className="bg-green-500">{t(`statuses.active`)}</Badge>
                ) : (
                  <Badge className="bg-red-500">
                    {t(`statuses.suspended`)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
