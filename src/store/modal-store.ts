import { create } from "zustand";

export type ModalType =
  | "create-account"
  | "create-merchant-member"
  | "create-merchant-mid"
  | "create-merchant-fee"
  | "create-merchant-item"
  | "create-bank-account"
  | "create-invoice"
  | "edit-invoice"
  | "create-notification"
  | "create-mid-setting"
  | "create-mid-fee";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: any;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
