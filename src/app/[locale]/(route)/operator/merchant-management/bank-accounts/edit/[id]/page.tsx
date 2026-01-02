"use client";
import BankAccountUpsertForm from "../../_components/bank-account-upsert-form";
import { useParams } from "next/navigation";

export default function EditBankAccountPage() {
  const { id } = useParams();
  return <BankAccountUpsertForm bankAccountId={id as string} />;
}
