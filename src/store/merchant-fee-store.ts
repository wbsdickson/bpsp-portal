import { create } from "zustand";

import { MOCK_MERCHANTS } from "@/lib/mock-data";
import { uuid } from "@/lib/utils";
import type {
  AppMerchantFee,
  MerchantFeeStatus,
  PaymentMethodType,
} from "@/types/merchant-fee";

type AddMerchantFeeInput = Omit<
  AppMerchantFee,
  "id" | "createdAt" | "updatedAt"
>;

type MerchantFeeStoreState = {
  fees: AppMerchantFee[];
  addFee: (fee: AddMerchantFeeInput) => void;
  updateFee: (id: string, data: Partial<AppMerchantFee>) => void;
  deleteFee: (id: string) => void;
  getFeeById: (id: string) => AppMerchantFee | undefined;
};

function buildInitialFees(): AppMerchantFee[] {
  const brands = ["VISA", "MASTERCARD", "JCB"];
  const methods: PaymentMethodType[] = ["card", "bank"];

  return MOCK_MERCHANTS.flatMap((m, idx) => {
    const createdAt = new Date(
      Date.now() - idx * 24 * 60 * 60 * 1000,
    ).toISOString();
    const updatedAt = new Date(
      Date.now() - idx * 6 * 60 * 60 * 1000,
    ).toISOString();
    const status: MerchantFeeStatus = idx % 4 === 0 ? "suspended" : "active";

    const brand = brands[idx % brands.length];
    const paymentMethodType = methods[idx % methods.length];
    const mdrPercent = paymentMethodType === "card" ? 3.2 : 1.1;
    const fixedFee = paymentMethodType === "card" ? 0.3 : 1.5;

    return [
      {
        id: uuid("fee"),
        merchantId: m.id,
        brand,
        paymentMethodType,
        mdrPercent,
        fixedFee,
        createdAt,
        updatedAt,
        status,
      },
    ];
  });
}

export const useMerchantFeeStore = create<MerchantFeeStoreState>(
  (set, get) => ({
    fees: buildInitialFees(),
    addFee: (fee: AddMerchantFeeInput) => {
      set((state) => ({
        fees: [
          {
            ...fee,
            id: uuid("fee"),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.fees,
        ],
      }));
    },
    updateFee: (id: string, data: Partial<AppMerchantFee>) => {
      set((state) => ({
        fees: state.fees.map((f) =>
          f.id === id
            ? {
                ...f,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : f,
        ),
      }));
    },
    deleteFee: (id: string) => {
      set((state) => ({ fees: state.fees.filter((f) => f.id !== id) }));
    },
    getFeeById: (id: string) => get().fees.find((f) => f.id === id),
  }),
);
