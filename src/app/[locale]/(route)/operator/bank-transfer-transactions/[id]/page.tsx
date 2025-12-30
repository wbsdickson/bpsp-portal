"use client";

import { useParams } from "next/navigation";

import BankTransferDetail from "../_components/bank-transfer-detail";

export default function OperatorBankTransferTransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  return <BankTransferDetail id={id} />;
}
