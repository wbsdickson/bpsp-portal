import { create } from 'zustand';
import { User, Invoice, Payment, UserRole, Notification } from './types';
import { MOCK_USERS, MOCK_INVOICES, MOCK_PAYMENTS, MOCK_NOTIFICATIONS } from './mock-data';

interface AppState {
    currentUser: User | null;
    originalAdmin: User | null; // Track admin when impersonating
    users: User[];
    invoices: Invoice[];
    payments: Payment[];
    notifications: Notification[];

    // Actions
    login: (role: UserRole) => void;
    loginAsUser: (userId: string) => void;
    logout: () => void;
    impersonateMerchant: (merchantId: string) => void;
    stopImpersonating: () => void;
    addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'status'>) => void;
    updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
    createPayment: (invoiceId: string, paymentMethod: string) => void;
    cancelPayment: (paymentId: string) => void;
    approvePayment: (paymentId: string) => void;
    updateUser: (userId: string, data: Partial<User>) => void;
    getMerchantInvoices: (merchantId: string) => Invoice[];
    getMerchantPayments: (merchantId: string) => Payment[];
    getMerchantNotifications: (merchantId: string) => Notification[];
    getAllInvoices: () => Invoice[]; // For Admin
    getAllPayments: () => Payment[]; // For Admin
}

export const useAppStore = create<AppState>((set, get) => ({
    currentUser: null,
    originalAdmin: null,
    users: MOCK_USERS,
    invoices: MOCK_INVOICES,
    payments: MOCK_PAYMENTS,
    notifications: MOCK_NOTIFICATIONS,

    login: (role: UserRole) => {
        // Simulate login by picking the first user of that role
        const user = MOCK_USERS.find(u => u.role === role);
        if (user) {
            set({ currentUser: user, originalAdmin: null });
        }
    },

    loginAsUser: (userId: string) => {
        const state = get();
        const user = state.users.find(u => u.id === userId);
        if (user) {
            set({ currentUser: user, originalAdmin: null });
        }
    },

    logout: () => set({ currentUser: null, originalAdmin: null }),

    impersonateMerchant: (merchantId: string) => {
        const state = get();
        const merchant = state.users.find(u => u.id === merchantId);
        if (merchant && state.currentUser?.role === 'admin') {
            set({
                originalAdmin: state.currentUser,
                currentUser: merchant
            });
        }
    },

    stopImpersonating: () => {
        const state = get();
        if (state.originalAdmin) {
            set({
                currentUser: state.originalAdmin,
                originalAdmin: null
            });
        }
    },

    addInvoice: (invoiceData) => {
        const newInvoice: Invoice = {
            ...invoiceData,
            id: `inv_${Math.random().toString(36).substr(2, 9)}`,
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
    },

    updateInvoiceStatus: (id, status) => {
        set((state) => ({
            invoices: state.invoices.map((inv) =>
                inv.id === id ? { ...inv, status } : inv
            ),
        }));
    },

    createPayment: (invoiceId, paymentMethod) => {
        const state = get();
        const invoice = state.invoices.find((inv) => inv.id === invoiceId);
        if (!invoice) return;

        const fee = invoice.amount * 0.02; // 2% fee
        const newPayment: Payment = {
            id: `pay_${Math.random().toString(36).substr(2, 9)}`,
            invoiceId,
            merchantId: invoice.merchantId,
            amount: invoice.amount,
            fee,
            totalAmount: invoice.amount + fee,
            status: 'pending_approval',
            paymentMethod,
            createdAt: new Date().toISOString().split('T')[0],
        }; set((state) => ({
            payments: [newPayment, ...state.payments],
            invoices: state.invoices.map((inv) =>
                inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
            ),
        }));
    },

    cancelPayment: (paymentId) => {
        set((state) => ({
            payments: state.payments.map((pay) =>
                pay.id === paymentId && pay.status === 'pending_approval'
                    ? { ...pay, status: 'failed' } // Or 'cancelled' if we add that status
                    : pay
            ),
        }));
    },

    approvePayment: (paymentId) => {
        set((state) => ({
            payments: state.payments.map((pay) =>
                pay.id === paymentId && pay.status === 'pending_approval'
                    ? { ...pay, status: 'settled', settledAt: new Date().toISOString().split('T')[0] }
                    : pay
            ),
        }));
    },

    // ...existing code...
    updateUser: (userId, data) => {
        set((state) => {
            const updatedUsers = state.users.map((user) =>
                user.id === userId ? { ...user, ...data } : user
            );
            const updatedCurrentUser = state.currentUser?.id === userId
                ? { ...state.currentUser, ...data }
                : state.currentUser;
            return {
                users: updatedUsers,
                currentUser: updatedCurrentUser
            };
        });
    },
    // ...existing code...

    getMerchantInvoices: (merchantId) => {
        return get().invoices.filter((inv) => inv.merchantId === merchantId);
    },

    getMerchantPayments: (merchantId) => {
        return get().payments.filter((pay) => pay.merchantId === merchantId);
    },

    getMerchantNotifications: (merchantId) => {
        return get().notifications.filter((notif) => notif.merchantId === merchantId);
    },

    getAllInvoices: () => get().invoices,
    getAllPayments: () => get().payments,
}));
