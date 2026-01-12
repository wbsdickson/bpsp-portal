"use client";

import { useRouter, useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { useBasePath } from "@/hooks/use-base-path";
import { usePurchaseOrderStore } from "@/store/merchant/purchase-order-store";
import PurchaseOrderDetail from "../_components/purchase-order-detail";

export default function MerchantPurchaseOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { basePath } = useBasePath();
  const locale = useLocale();
  const t = useTranslations("Merchant.PurchaseOrders");

  const purchaseOrder = usePurchaseOrderStore((s) =>
    id ? s.getPurchaseOrderById(id) : undefined,
  );

  if (!id || !purchaseOrder) {
    // Ideally handle 404 or redirect
    return null;
  }

  return (
    <div className="max-w-5xl space-y-6">
      <PageBreadcrumb items={[{ label: t("title"), href: basePath }]} />
      <PurchaseOrderDetail purchaseOrderId={id} />
    </div>
  );
}
