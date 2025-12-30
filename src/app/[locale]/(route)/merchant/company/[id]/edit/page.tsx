"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { AccountForm } from "@/app/[locale]/(route)/merchant/account/account-form";
import { useEffect, useMemo } from "react";

export default function EditAccountPage() {
  const { id } = useParams();
  const { getAccounts, currentUser } = useAppStore();
  const router = useRouter();


  const account = useMemo(() => {
    if (!id) return null;
    return getAccounts().find((a) => a.id === id) || null;
  }, [id, getAccounts]);

  useEffect(() => {
   
    if (id && !account) {
      router.replace("/dashboard/merchant/account");
    }
  }, [id, account, router]);

  if (!account || !currentUser) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Account</h2>
      <AccountForm account={account} />
    </div>
  );
}