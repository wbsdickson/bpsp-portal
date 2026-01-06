import { useModalStore } from "@/store/modal-store";
import { BaseModal } from "@/components/modals/base-modal";
import MerchantMemberUpsertForm from "../_components/merchant-member-upsert-form";
import { useTranslations } from "next-intl";

export const CreateMerchantMemberModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "create-merchant-member";
  const t = useTranslations("Operator.MerchantMembers");

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseModal
      open={isModalOpen}
      onOpenChange={handleClose}
      title={t("form.createTitle")}
      className="p-6"
    >
      <div>
        <MerchantMemberUpsertForm onSuccess={onClose} onCancel={handleClose} />
      </div>
    </BaseModal>
  );
};
