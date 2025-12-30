"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useClientStore } from "@/store/client-store";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ClientDetail({ clientId }: { clientId: string }) {
  const t = useTranslations("Operator.Clients");
  const router = useRouter();

  const client = useClientStore((s) => s.getClientById(clientId));
  const member = useMerchantMemberStore((s) =>
    client?.createdBy ? s.getMemberById(client.createdBy) : undefined,
  );

  if (!client || client.deletedAt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            {t("messages.notFound")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const registrationLabel = client.createdAt
    ? (() => {
        const dt = new Date(client.createdAt);
        return Number.isNaN(dt.getTime())
          ? client.createdAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{client.name}</CardTitle>
          <Button
            type="button"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push(`/operator/clients/edit/${client.id}`)}
          >
            {t("actions.edit")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
      </CardContent>
    </Card>
  );
}
