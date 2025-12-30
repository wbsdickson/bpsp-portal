"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import NotificationDetail from "../_components/notification-detail";

export default function OperatorNotificationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const t = useTranslations("Operator.Notifications");

  return (
    <HeaderPage title={t("title")}>
      <NotificationDetail id={id ?? ""} />
    </HeaderPage>
  );
}
