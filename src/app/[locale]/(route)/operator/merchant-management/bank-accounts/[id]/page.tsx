"use client";
import BankAccountDetail from "../_components/bank-account-detail";
import { useParams } from "next/navigation";

export default function BankAccountDetailPage() {
  const { id } = useParams();
  return <BankAccountDetail bankAccountId={id as string} />;
}
