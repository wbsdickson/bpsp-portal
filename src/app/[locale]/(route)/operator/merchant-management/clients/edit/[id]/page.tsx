"use client";
import ClientUpsertForm from "../../_components/client-upsert-form";
import { useParams } from "next/navigation";

export default function EditClientPage() {
  const { id } = useParams();
  return <ClientUpsertForm clientId={id as string} />;
}
