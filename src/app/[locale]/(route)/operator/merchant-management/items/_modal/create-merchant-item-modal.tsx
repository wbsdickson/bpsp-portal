import { useModalStore } from "@/store/modal-store";
import { BaseModal } from "@/components/modals/base-modal";
import ItemUpsertForm from "../_components/item-upsert-form";
import { useTranslations } from "next-intl";

export const CreateMerchantItemModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "create-merchant-item";
  const t = useTranslations("Operator.Items");

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
        <ItemUpsertForm onSuccess={onClose} onCancel={handleClose} />
      </div>
    </BaseModal>
  );
};
