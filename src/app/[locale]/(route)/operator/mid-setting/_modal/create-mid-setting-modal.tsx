"use client";

import { useModalStore } from "@/store/modal-store";
import { BaseModal } from "@/components/modals/base-modal";
import { useTranslations } from "next-intl";
import MidUpsertForm from "../_components/mid-upsert-form";

export const CreateMidSettingModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "create-mid-setting";
  const t = useTranslations("Operator.MID");

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseModal
      open={isModalOpen}
      onOpenChange={handleClose}
      title={t("form.createTitle")}
    >
      <MidUpsertForm
        onSuccess={onClose}
        onCancel={handleClose}
        isModal={true}
      />
    </BaseModal>
  );
};
