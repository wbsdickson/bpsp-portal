"use client";

import { useModalStore } from "@/store/modal-store";
import { BaseModal } from "@/components/modals/base-modal";
import { useTranslations } from "next-intl";
import MidFeeUpsertForm from "../_components/mid-fee-upsert-form";

export const CreateMidFeeModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "create-mid-fee";
  const t = useTranslations("Operator.MIDFee");

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseModal
      open={isModalOpen}
      onOpenChange={handleClose}
      title={t("form.createTitle")}
    >
      <MidFeeUpsertForm
        onSuccess={onClose}
        onCancel={handleClose}
        isModal={true}
      />
    </BaseModal>
  );
};
