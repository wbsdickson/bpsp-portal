import { useModalStore } from "@/store/modal-store";
import { BaseModal } from "@/components/modals/base-modal";
import MerchantFeeUpsertForm from "../_components/merchant-fee-upsert-form";
import { useTranslations } from "next-intl";

export const CreateMerchantFeeModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "create-merchant-fee";
  const t = useTranslations("Operator.MerchantFees");

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseModal
      open={isModalOpen}
      onOpenChange={handleClose}
      title={t("form.createTitle")}
    >
      <div className="py-2 pb-4">
        <MerchantFeeUpsertForm onSuccess={onClose} onCancel={handleClose} />
      </div>
    </BaseModal>
  );
};
