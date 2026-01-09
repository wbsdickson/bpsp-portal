"use client";
import ClientDetail from "../_components/client-detail";
import { useParams } from "next/navigation";

export default function ClientDetailPage() {
  const { id } = useParams();
  return <ClientDetail clientId={id as string} />;
}
