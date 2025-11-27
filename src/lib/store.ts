import { create } from 'zustand';
import { User, Invoice, Payment, UserRole, Notification, Merchant, Client, BankAccount, MerchantCard, Tax, Item, DocumentSettings, InvoiceAutoSetting, InvoiceTemplate, Quotation } from './types';
import { MOCK_USERS, MOCK_INVOICES, MOCK_PAYMENTS, MOCK_NOTIFICATIONS, MOCK_MERCHANTS, MOCK_CLIENTS, MOCK_BANK_ACCOUNTS, MOCK_MERCHANT_CARDS, MOCK_TAXES, MOCK_ITEMS, MOCK_DOCUMENT_SETTINGS, MOCK_INVOICE_AUTO_SETTINGS, MOCK_INVOICE_TEMPLATES, MOCK_QUOTATIONS } from './mock-data';

interface AppState {
    currentUser: User | null;
    originalAdmin: User | null; // Track admin when impersonating
    users: User[];
    merchants: Merchant[];
    clients: Client[];
    bankAccounts: BankAccount[];
    merchantCards: MerchantCard[];
    taxes: Tax[];
    items: Item[];
    documentSettings: DocumentSettings[];
    invoices: Invoice[];
    payments: Payment[];
    notifications: Notification[];
    invoiceAutoSettings: InvoiceAutoSetting[];
    invoiceTemplates: InvoiceTemplate[];
    quotations: Quotation[];

    // Actions
    login: (role: UserRole) => void;
    loginAsUser: (userId: string) => void;
    logout: () => void;
    impersonateMerchant: (merchantId: string) => void;
    stopImpersonating: () => void;
    addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'status'> & { status?: Invoice['status'] }) => void;
    updateInvoice: (id: string, data: Partial<Invoice>) => void;
    deleteInvoice: (id: string) => void;
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
    getMerchantItems: (merchantId: string) => Item[];
    addItem: (item: Item) => void;
    updateItem: (itemId: string, data: Partial<Item>) => void;
    deleteItem: (itemId: string) => void;
    getDocumentSettings: (merchantId: string) => DocumentSettings | undefined;
    updateDocumentSettings: (merchantId: string, data: Partial<DocumentSettings>) => void;
    getCurrentMerchant: () => Merchant | undefined;
    getAllInvoices: () => Invoice[]; // For Admin
    getAllPayments: () => Payment[]; // For Admin

    // Auto Issuance
    getMerchantInvoiceAutoSettings: (merchantId: string) => InvoiceAutoSetting[];
    addInvoiceAutoSetting: (setting: InvoiceAutoSetting) => void;
    updateInvoiceAutoSetting: (id: string, data: Partial<InvoiceAutoSetting>) => void;
    deleteInvoiceAutoSetting: (id: string) => void;

    // Templates
    getMerchantInvoiceTemplates: (merchantId: string) => InvoiceTemplate[];
    addInvoiceTemplate: (template: InvoiceTemplate) => void;
    updateInvoiceTemplate: (id: string, data: Partial<InvoiceTemplate>) => void;
    deleteInvoiceTemplate: (id: string) => void;

    // Quotations
    getMerchantQuotations: (merchantId: string) => Quotation[];
    addQuotation: (quotation: Quotation) => void;
    updateQuotation: (id: string, data: Partial<Quotation>) => void;
    deleteQuotation: (id: string) => void;
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
    items: MOCK_ITEMS,
    documentSettings: MOCK_DOCUMENT_SETTINGS,
    invoices: MOCK_INVOICES,
    payments: MOCK_PAYMENTS,
    notifications: MOCK_NOTIFICATIONS,
    invoiceAutoSettings: MOCK_INVOICE_AUTO_SETTINGS,
    invoiceTemplates: MOCK_INVOICE_TEMPLATES,
    quotations: MOCK_QUOTATIONS,


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
            status: invoiceData.status || 'draft',
            createdAt: new Date().toISOString(),
        } as Invoice;
        set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
    },

    updateInvoice: (id, data) => {
        set((state) => ({
            invoices: state.invoices.map((inv) =>
                inv.id === id ? { ...inv, ...data } : inv
            ),
        }));
    },

    deleteInvoice: (id) => {
        set((state) => ({
            invoices: state.invoices.map((inv) =>
                inv.id === id ? { ...inv, deletedAt: new Date().toISOString() } : inv
            ),
        }));
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
        return get().invoices.filter((inv) => inv.merchantId === merchantId && !inv.deletedAt);
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

    getMerchantItems: (merchantId) => {
        return get().items.filter((item) => item.merchantId === merchantId && !item.deletedAt);
    },

    addItem: (item) => {
        set((state) => ({ items: [item, ...state.items] }));
    },

    updateItem: (itemId, data) => {
        set((state) => ({
            items: state.items.map((item) =>
                item.id === itemId ? { ...item, ...data } : item
            ),
        }));
    },

    deleteItem: (itemId) => {
        set((state) => ({
            items: state.items.map((item) =>
                item.id === itemId
                    ? { ...item, deletedAt: new Date().toISOString() }
                    : item
            ),
        }));
    },

    getDocumentSettings: (merchantId) => {
        return get().documentSettings.find((s) => s.merchantId === merchantId);
    },

    updateDocumentSettings: (merchantId, data) => {
        set((state) => {
            const existing = state.documentSettings.find((s) => s.merchantId === merchantId);
            if (existing) {
                return {
                    documentSettings: state.documentSettings.map((s) =>
                        s.merchantId === merchantId ? { ...s, ...data } : s
                    ),
                };
            } else {
                // Create new if not exists
                const newSettings: DocumentSettings = {
                    merchantId,
                    companyName: '', // Default or from merchant name?
                    ...data,
                } as DocumentSettings;
                return {
                    documentSettings: [...state.documentSettings, newSettings],
                };
            }
        });
    },

    getCurrentMerchant: () => {
        const { currentUser, merchants } = get();
        if (!currentUser) return undefined;
        // In this mock, user.id is used as merchant.id for simplicity
        return merchants.find((m) => m.id === currentUser.id);
    },

    getAllInvoices: () => get().invoices,
    getAllPayments: () => get().payments,

    // Auto Issuance
    getMerchantInvoiceAutoSettings: (merchantId) => {
        return get().invoiceAutoSettings.filter((s) => s.merchantId === merchantId && !s.deletedAt);
    },

    addInvoiceAutoSetting: (setting) => {
        set((state) => ({ invoiceAutoSettings: [setting, ...state.invoiceAutoSettings] }));
    },

    updateInvoiceAutoSetting: (id, data) => {
        set((state) => ({
            invoiceAutoSettings: state.invoiceAutoSettings.map((s) =>
                s.id === id ? { ...s, ...data } : s
            ),
        }));
    },

    deleteInvoiceAutoSetting: (id) => {
        set((state) => ({
            invoiceAutoSettings: state.invoiceAutoSettings.map((s) =>
                s.id === id ? { ...s, deletedAt: new Date().toISOString() } : s
            ),
        }));
    },

    // Templates
    getMerchantInvoiceTemplates: (merchantId) => {
        return get().invoiceTemplates.filter((t) => t.merchantId === merchantId);
    },

    addInvoiceTemplate: (template) => {
        set((state) => ({ invoiceTemplates: [template, ...state.invoiceTemplates] }));
    },

    updateInvoiceTemplate: (id, data) => {
        set((state) => ({
            invoiceTemplates: state.invoiceTemplates.map((t) =>
                t.id === id ? { ...t, ...data } : t
            ),
        }));
    },

    deleteInvoiceTemplate: (id) => {
        set((state) => ({
            invoiceTemplates: state.invoiceTemplates.filter((t) => t.id !== id),
        }));
    },

    // Quotations
    getMerchantQuotations: (merchantId) => {
        return get().quotations.filter((q) => q.merchantId === merchantId && !q.deletedAt);
    },

    addQuotation: (quotation) => {
        set((state) => ({ quotations: [quotation, ...state.quotations] }));
    },

    updateQuotation: (id, data) => {
        set((state) => ({
            quotations: state.quotations.map((q) =>
                q.id === id ? { ...q, ...data } : q
            ),
        }));
    },

    deleteQuotation: (id) => {
        set((state) => ({
            quotations: state.quotations.map((q) =>
                q.id === id ? { ...q, deletedAt: new Date().toISOString() } : q
            ),
        }));
    },
}));
