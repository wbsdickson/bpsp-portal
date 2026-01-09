import { useModalStore } from "@/store/modal-store";
import { BaseModal } from "@/components/modals/base-modal";
import BankAccountUpsertForm from "../_components/bank-account-upsert-form";
import { useTranslations } from "next-intl";

export const CreateBankAccountModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "create-bank-account";
  const t = useTranslations("Merchant.BankAccounts");

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseModal
      open={isModalOpen}
      onOpenChange={handleClose}
      title={t("form.createTitle")}
      className="max-h-[80vh] overflow-y-auto p-6"
    >
      <div className="py-2 pb-4">
        <BankAccountUpsertForm onSuccess={onClose} onCancel={handleClose} />
      </div>
    </BaseModal>
  );
};
