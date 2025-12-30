import { create } from "zustand";

import { MOCK_CLIENTS } from "@/lib/mock-data";
import type { Client } from "@/lib/types";
import { uuid } from "@/lib/utils";

type AddClientInput = Omit<
  Client,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "createdBy" | "updatedBy"
> & {
  createdBy?: string;
};

export type ClientStoreState = {
  clients: Client[];
  addClient: (client: AddClientInput) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
};

export const useClientStore = create<ClientStoreState>((set, get) => ({
  clients: MOCK_CLIENTS,
  addClient: (client: AddClientInput) => {
    set((state) => ({
      clients: [
        {
          ...client,
          id: uuid("cli"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...state.clients,
      ],
    }));
  },
  updateClient: (id: string, data: Partial<Client>) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === id
          ? {
              ...c,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : c,
      ),
    }));
  },
  deleteClient: (id: string) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === id ? { ...c, deletedAt: new Date().toISOString() } : c,
      ),
    }));
  },
  getClientById: (id: string) => get().clients.find((c) => c.id === id),
}));
