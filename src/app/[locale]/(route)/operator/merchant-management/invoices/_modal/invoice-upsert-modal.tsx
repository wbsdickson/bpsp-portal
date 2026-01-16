"use client";

import { useModalStore } from "@/store/modal-store";
import { InvoiceUpsertPage } from "../_components/invoice-upsert";
import { BaseModal } from "@/components/modals/base-modal";

export const InvoiceUpsertModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();
  const isCreateModal = isOpen && type === "create-invoice";
  const isEditModal = isOpen && type === "edit-invoice";
  const isModalOpen = isCreateModal || isEditModal;
  const invoiceId = isEditModal ? data?.invoiceId : undefined;

  const handleClose = () => {
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <BaseModal
      open={isModalOpen}
      onOpenChange={handleClose}
      className="!left-0 !top-0 !m-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !p-0"
    >
      <InvoiceUpsertPage invoiceId={invoiceId} onClose={handleClose} />
    </BaseModal>
  );
};
