"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useBasePath } from "@/hooks/use-base-path";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import NotificationDetail from "../_components/notification-detail";

export default function OperatorNotificationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { basePath } = useBasePath();

  const t = useTranslations("Operator.Notifications");

  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];

  return (
    <div className="mx-auto w-[1280px] space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <NotificationDetail id={id ?? ""} />
    </div>
  );
}
