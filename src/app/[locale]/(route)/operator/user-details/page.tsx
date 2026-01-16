"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import UserProfile from "./_components/user-profile";

export default function UserDetailsPage() {
  const t = useTranslations("CommonComponent.TeamSwitcher");
  return (
    <HeaderPage title={t("userDetails") || "User Details"}>
      <div className="max-w-4xl space-y-6">
        <UserProfile />
      </div>
    </HeaderPage>
  );
}
