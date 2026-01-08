"use client";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import DeliveryNoteDetail from "../_components/delivery-note-detail";
import { useParams } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import { useTranslations } from "next-intl";

export default function DeliveryNoteDetailPage() {
  const { id } = useParams();
  const { basePath } = useBasePath();
  const t = useTranslations("Merchant.DeliveryNotes");

  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id as string, active: true },
  ];

  return (
    <div className="mx-auto w-[1280px] space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <DeliveryNoteDetail deliveryNoteId={id as string} />
    </div>
  );
}
