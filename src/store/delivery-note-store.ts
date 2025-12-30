import { create } from "zustand";

import { MOCK_DELIVERY_NOTES } from "@/lib/mock-data";
import type { DeliveryNote } from "@/lib/types";
import { uuid } from "@/lib/utils";

type AddDeliveryNoteInput = Omit<
  DeliveryNote,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

type DeliveryNoteStoreState = {
  deliveryNotes: DeliveryNote[];
  addDeliveryNote: (dn: AddDeliveryNoteInput) => void;
  updateDeliveryNote: (id: string, data: Partial<DeliveryNote>) => void;
  deleteDeliveryNote: (id: string) => void;
  getDeliveryNoteById: (id: string) => DeliveryNote | undefined;
};

export const useDeliveryNoteStore = create<DeliveryNoteStoreState>(
  (set, get) => ({
    deliveryNotes: MOCK_DELIVERY_NOTES,
    addDeliveryNote: (dn: AddDeliveryNoteInput) => {
      set((state) => ({
        deliveryNotes: [
          {
            ...dn,
            id: uuid("dn"),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.deliveryNotes,
        ],
      }));
    },
    updateDeliveryNote: (id: string, data: Partial<DeliveryNote>) => {
      set((state) => ({
        deliveryNotes: state.deliveryNotes.map((dn) =>
          dn.id === id
            ? {
                ...dn,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : dn,
        ),
      }));
    },
    deleteDeliveryNote: (id: string) => {
      set((state) => ({
        deliveryNotes: state.deliveryNotes.map((dn) =>
          dn.id === id ? { ...dn, deletedAt: new Date().toISOString() } : dn,
        ),
      }));
    },
    getDeliveryNoteById: (id: string) =>
      get().deliveryNotes.find((dn) => dn.id === id),
  }),
);
