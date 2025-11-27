import { create } from 'zustand';
import { User, Invoice, Payment, UserRole, Notification, Merchant, Client, BankAccount, MerchantCard, Tax } from './types';
import { MOCK_USERS, MOCK_INVOICES, MOCK_PAYMENTS, MOCK_NOTIFICATIONS, MOCK_MERCHANTS, MOCK_CLIENTS, MOCK_BANK_ACCOUNTS, MOCK_MERCHANT_CARDS, MOCK_TAXES } from './mock-data';

interface AppState {
    currentUser: User | null;
    originalAdmin: User | null; // Track admin when impersonating
    users: User[];
    merchants: Merchant[];
    clients: Client[];
    bankAccounts: BankAccount[];
    merchantCards: MerchantCard[];
    taxes: Tax[];
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
    updateMerchant: (merchantId: string, data: Partial<Merchant>) => void;
    getMerchantInvoices: (merchantId: string) => Invoice[];
    getMerchantPayments: (merchantId: string) => Payment[];
    getMerchantNotifications: (merchantId: string) => Notification[];
    getMerchantMembers: (merchantId: string) => User[];
    addMember: (user: User) => void;
    updateMember: (userId: string, data: Partial<User>) => void;
    deleteMember: (userId: string) => void;
    getMerchantClients: (merchantId: string) => Client[];
    addClient: (client: Client) => void;
    updateClient: (clientId: string, data: Partial<Client>) => void;
    deleteClient: (clientId: string) => void;
    getMerchantBankAccounts: (merchantId: string) => BankAccount[];
    addBankAccount: (bankAccount: BankAccount) => void;
    updateBankAccount: (bankAccountId: string, data: Partial<BankAccount>) => void;
    deleteBankAccount: (bankAccountId: string) => void;
    getMerchantCards: (merchantId: string) => MerchantCard[];
    deleteMerchantCard: (cardId: string) => void;
    getCurrentMerchant: () => Merchant | undefined;
    getAllInvoices: () => Invoice[]; // For Admin
    getAllPayments: () => Payment[]; // For Admin
}

export const useAppStore = create<AppState>((set, get) => ({
    currentUser: null,
    originalAdmin: null,
    users: MOCK_USERS,
    merchants: MOCK_MERCHANTS,
    clients: MOCK_CLIENTS,
    bankAccounts: MOCK_BANK_ACCOUNTS,
    merchantCards: MOCK_MERCHANT_CARDS,
    taxes: MOCK_TAXES,
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

    updateMerchant: (merchantId, data) => {
        set((state) => ({
            merchants: state.merchants.map((merchant) =>
                merchant.id === merchantId ? { ...merchant, ...data } : merchant
            ),
        }));
    },

    getMerchantInvoices: (merchantId) => {
        return get().invoices.filter((inv) => inv.merchantId === merchantId);
    },

    getMerchantPayments: (merchantId) => {
        return get().payments.filter((pay) => pay.merchantId === merchantId);
    },

    getMerchantNotifications: (merchantId) => {
        return get().notifications.filter((notif) => notif.merchantId === merchantId);
    },

    getMerchantMembers: (merchantId) => {
        return get().users.filter((user) => user.merchantId === merchantId && !user.deletedAt);
    },

    addMember: (user) => {
        set((state) => ({ users: [user, ...state.users] }));
    },

    updateMember: (userId, data) => {
        set((state) => ({
            users: state.users.map((user) =>
                user.id === userId ? { ...user, ...data } : user
            ),
        }));
    },

    deleteMember: (userId) => {
        set((state) => ({
            users: state.users.map((user) =>
                user.id === userId
                    ? { ...user, deletedAt: new Date().toISOString() }
                    : user
            ),
        }));
    },

    getMerchantClients: (merchantId) => {
        return get().clients.filter((client) => client.merchantId === merchantId && !client.deletedAt);
    },

    addClient: (client) => {
        set((state) => ({ clients: [client, ...state.clients] }));
    },

    updateClient: (clientId, data) => {
        set((state) => ({
            clients: state.clients.map((client) =>
                client.id === clientId ? { ...client, ...data } : client
            ),
        }));
    },

    deleteClient: (clientId) => {
        set((state) => ({
            clients: state.clients.map((client) =>
                client.id === clientId
                    ? { ...client, deletedAt: new Date().toISOString() }
                    : client
            ),
        }));
    },

    getMerchantBankAccounts: (merchantId) => {
        return get().bankAccounts.filter((account) => account.merchantId === merchantId && !account.deletedAt);
    },

    addBankAccount: (bankAccount) => {
        set((state) => ({ bankAccounts: [bankAccount, ...state.bankAccounts] }));
    },

    updateBankAccount: (bankAccountId, data) => {
        set((state) => ({
            bankAccounts: state.bankAccounts.map((account) =>
                account.id === bankAccountId ? { ...account, ...data } : account
            ),
        }));
    },

    deleteBankAccount: (bankAccountId) => {
        set((state) => ({
            bankAccounts: state.bankAccounts.map((account) =>
                account.id === bankAccountId
                    ? { ...account, deletedAt: new Date().toISOString() }
                    : account
            ),
        }));
    },

    getMerchantCards: (merchantId) => {
        return get().merchantCards.filter((card) => card.merchantId === merchantId);
    },

    deleteMerchantCard: (cardId) => {
        set((state) => ({
            merchantCards: state.merchantCards.filter((card) => card.id !== cardId),
        }));
    },

    getCurrentMerchant: () => {
        const { currentUser, merchants } = get();
        if (!currentUser) return undefined;
        // In this mock, user.id is used as merchant.id for simplicity
        return merchants.find((m) => m.id === currentUser.id);
    },

    getAllInvoices: () => get().invoices,
    getAllPayments: () => get().payments,
}));
