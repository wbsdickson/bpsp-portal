"use client";

  import { useAppStore } from "@/lib/store";
  import { CompanyList } from "./company-list";
import HeaderPage from "@/components/header-page";

export default function CompanyInformationManagementPage() {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return <div>Please log in</div>;
  }

  return (
    <HeaderPage title="Company Information Management">
      <CompanyList />
    </HeaderPage>
  );
}
