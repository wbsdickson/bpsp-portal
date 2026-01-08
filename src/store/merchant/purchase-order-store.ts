import { create } from "zustand";

import { MOCK_PURCHASE_ORDERS } from "@/lib/mock-data";
import type { PurchaseOrder } from "@/lib/types";
import { uuid } from "@/lib/utils";

type AddPurchaseOrderInput = Omit<
  PurchaseOrder,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

type PurchaseOrderStoreState = {
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (purchaseOrder: AddPurchaseOrderInput) => void;
  updatePurchaseOrder: (id: string, data: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;
  getPurchaseOrderById: (id: string) => PurchaseOrder | undefined;
};

export const usePurchaseOrderStore = create<PurchaseOrderStoreState>(
  (set, get) => ({
    purchaseOrders: MOCK_PURCHASE_ORDERS,
    addPurchaseOrder: (purchaseOrder: AddPurchaseOrderInput) => {
      set((state) => ({
        purchaseOrders: [
          {
            ...purchaseOrder,
            id: uuid("qt"),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.purchaseOrders,
        ],
      }));
    },
    updatePurchaseOrder: (id: string, data: Partial<PurchaseOrder>) => {
      set((state) => ({
        purchaseOrders: state.purchaseOrders.map((q) =>
          q.id === id
            ? {
                ...q,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : q,
        ),
      }));
    },
    deletePurchaseOrder: (id: string) => {
      set((state) => ({
        purchaseOrders: state.purchaseOrders.map((q) =>
          q.id === id ? { ...q, deletedAt: new Date().toISOString() } : q,
        ),
      }));
    },
    getPurchaseOrderById: (id: string) =>
      get().purchaseOrders.find((q) => q.id === id),
  }),
);
