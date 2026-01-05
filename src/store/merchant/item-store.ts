import { create } from "zustand";

import { MOCK_ITEMS } from "@/lib/mock-data";
import type { Item } from "@/lib/types";
import { uuid } from "@/lib/utils";

type AddItemInput = Omit<Item, "id" | "createdAt" | "updatedAt" | "deletedAt">;

type ItemStoreState = {
  items: Item[];
  addItem: (item: AddItemInput) => void;
  updateItem: (id: string, data: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => Item | undefined;
};

export const useItemStore = create<ItemStoreState>((set, get) => ({
  items: MOCK_ITEMS,
  addItem: (item: AddItemInput) => {
    set((state) => ({
      items: [
        {
          ...item,
          id: uuid("item"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...state.items,
      ],
    }));
  },
  updateItem: (id: string, data: Partial<Item>) => {
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id
          ? {
              ...it,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : it,
      ),
    }));
  },
  deleteItem: (id: string) => {
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id ? { ...it, deletedAt: new Date().toISOString() } : it,
      ),
    }));
  },
  getItemById: (id: string) => get().items.find((it) => it.id === id),
}));
