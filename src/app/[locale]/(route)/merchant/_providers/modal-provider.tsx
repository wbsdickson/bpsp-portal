"use client";

import { useState, useEffect } from "react";
import { CreateMerchantItemModal } from "../items/_modal/create-merchant-item-modal";
import { CreateBankAccountModal } from "../bank-accounts/_modal/create-merchant-bank-modal";
// Import other modals as needed

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Add all merchant route modals here */}
      <CreateMerchantItemModal />
      <CreateBankAccountModal />
    </>
  );
};
