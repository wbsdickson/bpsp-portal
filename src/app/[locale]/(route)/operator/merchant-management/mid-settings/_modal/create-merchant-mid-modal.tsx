import { useModalStore } from "@/store/modal-store";
import { BaseModal } from "@/components/modals/base-modal";
import MerchantMidUpsertForm from "../_components/merchant-mid-upsert-form";
import { useTranslations } from "next-intl";

export const CreateMerchantMidModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "create-merchant-mid";
  const t = useTranslations("Operator.MerchantMIDs");

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
        <MerchantMidUpsertForm onSuccess={onClose} onCancel={handleClose} />
      </div>
    </BaseModal>
  );
};
