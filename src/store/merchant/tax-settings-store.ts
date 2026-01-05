import { create } from "zustand";

import { useMerchantStore } from "@/store/merchant-store";
import { useTaxStore } from "@/store/tax-store";
import type {
  MerchantTaxSettings,
  TaxRoundingMethod,
} from "@/types/tax-settings";

type UpsertMerchantTaxSettingsInput = Omit<MerchantTaxSettings, "updatedAt">;

type TaxSettingsStoreState = {
  settings: MerchantTaxSettings[];
  getByMerchantId: (merchantId: string) => MerchantTaxSettings | undefined;
  upsert: (data: UpsertMerchantTaxSettingsInput) => void;
};

function buildInitialSettings(): MerchantTaxSettings[] {
  const merchants = useMerchantStore.getState().merchants;
  const taxes = useTaxStore.getState().taxes;

  const rateById = new Map(taxes.map((t) => [t.id, t.rate ?? 0] as const));

  return merchants.map((m) => {
    const defaultTaxId = m.defaultTaxId ?? "tax_10";
    const defaultRate = rateById.get(defaultTaxId) ?? 0;

    return {
      merchantId: m.id,
      taxable: defaultTaxId !== "tax_00" && defaultRate > 0,
      taxRate: defaultRate,
      roundingMethod: "round" as TaxRoundingMethod,
      updatedAt: new Date().toISOString(),
    } satisfies MerchantTaxSettings;
  });
}

export const useTaxSettingsStore = create<TaxSettingsStoreState>(
  (set, get) => ({
    settings: buildInitialSettings(),
    getByMerchantId: (merchantId: string) =>
      get().settings.find((s) => s.merchantId === merchantId),
    upsert: (data: UpsertMerchantTaxSettingsInput) => {
      set((state) => {
        const now = new Date().toISOString();
        const existing = state.settings.find(
          (s) => s.merchantId === data.merchantId,
        );

        if (existing) {
          return {
            settings: state.settings.map((s) =>
              s.merchantId === data.merchantId
                ? { ...s, ...data, updatedAt: now }
                : s,
            ),
          };
        }

        return {
          settings: [...state.settings, { ...data, updatedAt: now }],
        };
      });
    },
  }),
);
