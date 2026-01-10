import { create } from "zustand";

import { MOCK_MERCHANT_NOTIFICATIONS } from "@/lib/mock-data";
import type { MerchantNotification } from "@/lib/types";
import { uuid } from "@/lib/utils";

type AddNotificationInput = Omit<
  MerchantNotification,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

type NotificationStoreState = {
  notifications: MerchantNotification[];
  addNotification: (n: AddNotificationInput) => void;
  updateNotification: (id: string, data: Partial<Notification>) => void;
  deleteNotification: (id: string) => void;
  getNotificationById: (id: string) => MerchantNotification | undefined;
};

export const useNotificationStore = create<NotificationStoreState>(
  (set, get) => ({
    notifications: MOCK_MERCHANT_NOTIFICATIONS,
    addNotification: (n) => {
      set((state) => ({
        notifications: [
          {
            ...n,
            id: uuid("notif"),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.notifications,
        ],
      }));
    },
    updateNotification: (id, data) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id
            ? {
                ...n,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : n,
        ),
      }));
    },
    deleteNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, deletedAt: new Date().toISOString() } : n,
        ),
      }));
    },
    getNotificationById: (id) => get().notifications.find((n) => n.id === id),
  }),
);
