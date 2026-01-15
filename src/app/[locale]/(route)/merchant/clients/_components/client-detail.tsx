"use client";

import { Button } from "@/components/ui/button";
import { useClientStore } from "@/store/client-store";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import Link from "next/link";

export default function ClientDetail({ clientId }: { clientId: string }) {
  const t = useTranslations("Merchant.Clients");
  const router = useRouter();
  const { basePath } = useBasePath();

  const client = useClientStore((s) => s.getClientById(clientId));
  const member = useMerchantMemberStore((s) =>
    client?.createdBy ? s.getMemberById(client.createdBy) : undefined,
  );

  if (!client || client.deletedAt) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`${basePath}?tab=table`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  const registrationLabel = client.createdAt
    ? (() => {
      const dt = new Date(client.createdAt);
      return Number.isNaN(dt.getTime())
        ? client.createdAt
        : dt.toLocaleDateString();
    })()
    : "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {client.name}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => {
              router.push(`${basePath}/edit/${client.id}`);
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
            <div className="font-medium">{client.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.contactPerson")}
            </div>
            <div className="font-medium">{member?.name ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.phoneNumber")}
            </div>
            <div className="font-medium">{client.phoneNumber}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.email")}
            </div>
            <div className="font-medium">{client.email}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.address")}
            </div>
            <div className="font-medium">{client.address || "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.registrationDate")}
            </div>
            <div className="font-medium">{registrationLabel}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.merchantId")}
            </div>
            <div className="font-medium">{client.merchantId}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
