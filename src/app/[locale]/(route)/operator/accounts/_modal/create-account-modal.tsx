import { useRef, useState } from "react";
import { useModalStore } from "@/store/modal-store";
import { BaseModal } from "@/components/modals/base-modal";
import UserUpsertForm, {
  type UserUpsertFormHandle,
} from "../_components/user-upsert-form";

export const CreateAccountModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "create-account";
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const formRef = useRef<UserUpsertFormHandle>(null);

  const handleClose = () => {
    // Check if form is dirty using the ref
    // if (formRef.current?.isDirty) {
    //   setShowConfirmClose(true);
    // } else {
    //   onClose();
    // }
    onClose();
  };

  const onConfirmClose = () => {
    setShowConfirmClose(false);
    onClose();
  };

  return (
    <>
      <BaseModal
        open={isModalOpen}
        onOpenChange={handleClose}
        title="Create Account"
        description="Add a new account to manage operations."
      >
        <UserUpsertForm
          ref={formRef}
          onSuccess={onClose}
          onCancel={handleClose}
        />
      </BaseModal>
    </>
  );
};
