"use client";

import { Button } from "@/components/ui/button";
import { useMerchantMemberStore } from "@/store/merchant/merchant-member-store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import Link from "next/link";

export default function MerchantMemberDetail({ userId }: { userId: string }) {
  const t = useTranslations("Merchant.MerchantMembers");
  const router = useRouter();
  const { basePath } = useBasePath();

  const user = useMerchantMemberStore((s) => s.getMemberById(userId));

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.userNotFound")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`${basePath}?tab=table`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  const lastLoginLabel = user.lastLoginAt
    ? (() => {
      const dt = new Date(user.lastLoginAt);
      return Number.isNaN(dt.getTime())
        ? user.lastLoginAt
        : dt.toLocaleDateString();
    })()
    : "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {user.name}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => {
              router.push(`${basePath}/edit/${user.id}`);
            }}
            title={t("actions.edit")}
          >
            {t("actions.edit")}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-md p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.name")}
            </div>
            <div className="font-medium">{user.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.email")}
            </div>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.role")}
            </div>
            <div className="font-medium">
              {user.memberRole ?? user.role ?? "—"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.lastLoginAt")}
            </div>
            <div className="font-medium">{lastLoginLabel}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.status")}
            </div>
            <div className="font-medium">{user.status ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.merchantId")}
            </div>
            <div className="font-medium">{user.merchantId ?? "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
