"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CreateAccountModal } from "../accounts/_modal/create-account-modal";
import { CreateMerchantMemberModal } from "../merchant-management/members/_modal/create-merchant-member-modal";
import { CreateMerchantMidModal } from "../merchant-management/mid-settings/_modal/create-merchant-mid-modal";
import { CreateMerchantFeeModal } from "../merchant-management/fee-rate/_modal/create-merchant-fee-modal";
import { CreateMidSettingModal } from "../mid-setting/_modal/create-mid-setting-modal";
import { CreateMidFeeModal } from "../mid-fee/_modal/create-mid-fee-modal";
import { CreateMerchantItemModal } from "../merchant-management/items/_modal/create-merchant-item-modal";
import { CreateNotificationModal } from "../notifications/_modal/create-notification-modal";
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isAuthenticated = status === "authenticated" && !!session;

  return (
    <>
      {/* <ForcedLogoutModal /> */}

      {isAuthenticated && (
        <>
          <CreateAccountModal />
          <CreateMerchantMemberModal />
          <CreateMerchantMidModal />
          <CreateMerchantFeeModal />
          <CreateMerchantItemModal />
          <CreateNotificationModal />
          <CreateMidSettingModal />
          <CreateMidFeeModal />
        </>
      )}
    </>
  );
};
