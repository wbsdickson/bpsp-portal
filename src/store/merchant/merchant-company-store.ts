import { create } from "zustand";

import { MOCK_COMPANIES } from "@/lib/mock-data";
import type { Company } from "@/lib/types";

type MerchantCompanyStoreState = {
  companies: Company[];
  getCompanyById: (id: string) => Company | undefined;
  getCompaniesByMerchantId: (merchantId: string) => Company[];
  addCompany: (company: Company) => void;
  updateCompany: (companyId: string, data: Partial<Company>) => void;
  deleteCompany: (companyId: string) => void;
};

export const useMerchantCompanyStore = create<MerchantCompanyStoreState>(
  (set, get) => ({
    companies: MOCK_COMPANIES as Company[],

    getCompanyById: (id: string) => get().companies.find((c) => c.id === id),

    getCompaniesByMerchantId: (merchantId: string) =>
      get().companies.filter((c) => c.createdBy === merchantId && !c.deletedAt),

    addCompany: (company: Company) => {
      set((state) => ({ companies: [company, ...state.companies] }));
    },

    updateCompany: (companyId: string, data: Partial<Company>) => {
      set((state) => ({
        companies: state.companies.map((c) =>
          c.id === companyId ? { ...c, ...data } : c,
        ),
      }));
    },

    deleteCompany: (companyId: string) => {
      set((state) => ({
        companies: state.companies.map((c) =>
          c.id === companyId
            ? { ...c, deletedAt: new Date().toISOString() }
            : c,
        ),
      }));
    },
  }),
);
