"use client";

import { useModalStore } from "@/store/modal-store";
import { BaseModal } from "@/components/modals/base-modal";
import { useTranslations } from "next-intl";
import NotificationUpsertForm from "../_components/notification-upsert-form";

export const CreateNotificationModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "create-notification";
  const t = useTranslations("Operator.Notifications");

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseModal
      open={isModalOpen}
      onOpenChange={handleClose}
      title={t("form.createTitle")}
    >
      <NotificationUpsertForm
        mode="create"
        onSuccess={onClose}
        onCancel={handleClose}
        isModal={true}
      />
    </BaseModal>
  );
};
