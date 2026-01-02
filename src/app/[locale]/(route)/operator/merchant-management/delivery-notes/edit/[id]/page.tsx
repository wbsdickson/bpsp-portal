"use client";
import { useParams } from "next/navigation";
import DeliveryNoteUpsertForm from "../../_components/delivery-note-upsert-form";

export default function EditDeliveryNotePage() {
  const { id } = useParams();
  return <DeliveryNoteUpsertForm deliveryNoteId={id as string} />;
}
