"use client";
import DeliveryNoteDetail from "../_components/delivery-note-detail";
import { useParams } from "next/navigation";

export default function DeliveryNoteDetailPage() {
  const { id } = useParams();
  return <DeliveryNoteDetail deliveryNoteId={id as string} />;
}
