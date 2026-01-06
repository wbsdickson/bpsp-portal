import { create } from "zustand";
import {
  User,
  Invoice,
  Payment,
  UserRole,
  Notification,
  NotificationRead,
  Merchant,
  Client,
  BankAccount,
  MerchantCard,
  Tax,
  Item,
  DocumentSettings,
  InvoiceAutoSetting,
  InvoiceTemplate,
  Quotation,
  PurchaseOrder,
  DeliveryNote,
  Receipt,
  MerchantSignup,
  Transaction,
} from "./types";
import {
  MOCK_USERS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_NOTIFICATION_READS,
  MOCK_MERCHANTS,
  MOCK_CLIENTS,
  MOCK_BANK_ACCOUNTS,
  MOCK_MERCHANT_CARDS,
  MOCK_TAXES,
  MOCK_ITEMS,
  MOCK_DOCUMENT_SETTINGS,
  MOCK_INVOICE_AUTO_SETTINGS,
  MOCK_INVOICE_TEMPLATES,
  MOCK_QUOTATIONS,
  MOCK_PURCHASE_ORDERS,
  MOCK_DELIVERY_NOTES,
  MOCK_RECEIPTS,
} from "./mock-data";

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
  notificationReads: NotificationRead[];
  invoiceAutoSettings: InvoiceAutoSetting[];
  invoiceTemplates: InvoiceTemplate[];
  quotations: Quotation[];
  purchaseOrders: PurchaseOrder[];
  deliveryNotes: DeliveryNote[];
  receipts: Receipt[];
  merchantSignups: MerchantSignup[]; // Track merchant signups

  // Actions
  login: (role: UserRole) => void;
  loginAsUser: (userId: string) => void;
  logout: () => void;
  impersonateMerchant: (merchantId: string) => void;
  stopImpersonating: () => void;
  addInvoice: (
    invoice: Omit<Invoice, "id" | "createdAt" | "status"> & {
      status?: Invoice["status"];
    },
  ) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void;
  createPayment: (invoiceId: string, paymentMethod: string) => void;
  cancelPayment: (paymentId: string) => void;
  approvePayment: (paymentId: string) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  updateMerchant: (merchantId: string, data: Partial<Merchant>) => void;
  getMerchantInvoices: (merchantId: string) => Invoice[];
  getMerchantPayments: (merchantId: string) => Payment[];
  getMerchantNotifications: (
    merchantId: string,
    userId?: string,
  ) => (Notification & { isRead: boolean })[];
  markNotificationAsRead: (notificationId: string, userId: string) => void;
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
  updateBankAccount: (
    bankAccountId: string,
    data: Partial<BankAccount>,
  ) => void;
  deleteBankAccount: (bankAccountId: string) => void;
  getMerchantCards: (merchantId: string) => MerchantCard[];
  addMerchantCard: (card: MerchantCard) => void;
  deleteMerchantCard: (cardId: string) => void;
  getMerchantItems: (merchantId: string) => Item[];
  addItem: (item: Item) => void;
  updateItem: (itemId: string, data: Partial<Item>) => void;
  deleteItem: (itemId: string) => void;
  getDocumentSettings: (merchantId: string) => DocumentSettings | undefined;
  updateDocumentSettings: (
    merchantId: string,
    data: Partial<DocumentSettings>,
  ) => void;
  getCurrentMerchant: () => Merchant | undefined;
  getAllInvoices: () => Invoice[]; // For Admin
  getAllPayments: () => Payment[]; // For Admin

  // Auto Issuance
  getMerchantInvoiceAutoSettings: (merchantId: string) => InvoiceAutoSetting[];
  addInvoiceAutoSetting: (setting: InvoiceAutoSetting) => void;
  updateInvoiceAutoSetting: (
    id: string,
    data: Partial<InvoiceAutoSetting>,
  ) => void;
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

  // Purchase Orders
  getMerchantPurchaseOrders: (merchantId: string) => PurchaseOrder[];
  addPurchaseOrder: (purchaseOrder: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, data: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;

  // Delivery Notes
  getMerchantDeliveryNotes: (merchantId: string) => DeliveryNote[];
  addDeliveryNote: (
    deliveryNote: Omit<DeliveryNote, "id" | "createdAt">,
  ) => void;
  updateDeliveryNote: (id: string, data: Partial<DeliveryNote>) => void;
  deleteDeliveryNote: (id: string) => void;

  // Receipts
  getMerchantReceipts: (merchantId: string) => Receipt[];
  addReceipt: (receipt: Receipt) => void;
  updateReceipt: (id: string, data: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;

  // Registration
  createMerchantSignup: (email: string) => string; // Returns token
  validateSignupToken: (token: string) => MerchantSignup | null;
  completeMerchantRegistration: (
    token: string,
    merchantData: Partial<Merchant>,
    userData: Partial<User>,
  ) => void;

  // Payment Flow
  getInvoiceById: (id: string) => Invoice | undefined;
  processPayment: (
    invoiceId: string,
    cardData: unknown,
  ) => Promise<{ success: boolean; error?: string; transactionId?: string }>;
  getTransactionByInvoiceId: (invoiceId: string) => Transaction | undefined;
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
  notificationReads: MOCK_NOTIFICATION_READS,
  invoiceAutoSettings: MOCK_INVOICE_AUTO_SETTINGS,
  invoiceTemplates: MOCK_INVOICE_TEMPLATES,
  quotations: MOCK_QUOTATIONS,
  purchaseOrders: MOCK_PURCHASE_ORDERS,
  deliveryNotes: MOCK_DELIVERY_NOTES,
  receipts: MOCK_RECEIPTS,
  merchantSignups: [],
  login: (role: UserRole) => {
    // Simulate login by picking the first user of that role
    const user = MOCK_USERS.find((u) => u.role === role);
    if (user) {
      set({ currentUser: user, originalAdmin: null });
    }
  },

  loginAsUser: (userId: string) => {
    const state = get();
    const user = state.users.find((u) => u.id === userId);
    if (user) {
      set({ currentUser: user, originalAdmin: null });
    }
  },

  logout: () => set({ currentUser: null, originalAdmin: null }),

  impersonateMerchant: (merchantId: string) => {
    const state = get();
    const merchant = state.users.find((u) => u.id === merchantId);
    if (merchant && state.currentUser?.role === "admin") {
      set({
        originalAdmin: state.currentUser,
        currentUser: merchant,
      });
    }
  },

  stopImpersonating: () => {
    const state = get();
    if (state.originalAdmin) {
      set({
        currentUser: state.originalAdmin,
        originalAdmin: null,
      });
    }
  },

  addInvoice: (invoiceData) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv_${Math.random().toString(36).substr(2, 9)}`,
      status: invoiceData.status || "draft",
      createdAt: new Date().toISOString(),
    } as Invoice;
    set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
  },

  updateInvoice: (id, data) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, ...data } : inv,
      ),
    }));
  },

  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, deletedAt: new Date().toISOString() } : inv,
      ),
    }));
  },

  updateInvoiceStatus: (id, status) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, status } : inv,
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
      status: "pending_approval",
      paymentMethod,
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({
      payments: [newPayment, ...state.payments],
      invoices: state.invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "paid" } : inv,
      ),
    }));
  },

  cancelPayment: (paymentId) => {
    set((state) => ({
      payments: state.payments.map((pay) =>
        pay.id === paymentId && pay.status === "pending_approval"
          ? { ...pay, status: "failed" } // Or 'cancelled' if we add that status
          : pay,
      ),
    }));
  },

  approvePayment: (paymentId) => {
    set((state) => ({
      payments: state.payments.map((pay) =>
        pay.id === paymentId && pay.status === "pending_approval"
          ? {
              ...pay,
              status: "settled",
              settledAt: new Date().toISOString().split("T")[0],
            }
          : pay,
      ),
    }));
  },

  updateUser: (userId, data) => {
    set((state) => {
      const updatedUsers = state.users.map((user) =>
        user.id === userId ? { ...user, ...data } : user,
      );
      const updatedCurrentUser =
        state.currentUser?.id === userId
          ? { ...state.currentUser, ...data }
          : state.currentUser;
      return {
        users: updatedUsers,
        currentUser: updatedCurrentUser,
      };
    });
  },

  updateMerchant: (merchantId, data) => {
    set((state) => ({
      merchants: state.merchants.map((merchant) =>
        merchant.id === merchantId ? { ...merchant, ...data } : merchant,
      ),
    }));
  },

  getMerchantInvoices: (merchantId) => {
    return get().invoices.filter(
      (inv) => inv.merchantId === merchantId && !inv.deletedAt,
    );
  },

  getMerchantPayments: (merchantId) => {
    return get().payments.filter((pay) => pay.merchantId === merchantId);
  },

  getMerchantNotifications: (merchantId, userId) => {
    const state = get();
    const now = new Date();

    return state.notifications
      .filter((notif) => {
        // 1. Target User Type
        if (
          notif.targetUserType &&
          notif.targetUserType !== "merchant" &&
          notif.targetUserType !== "all"
        ) {
          return false;
        }

        // 2. Target Merchant
        if (notif.merchantId && notif.merchantId !== merchantId) {
          return false;
        }

        // 3. Publication Period
        if (
          notif.publicationStartDate &&
          new Date(notif.publicationStartDate) > now
        ) {
          return false;
        }
        if (
          notif.publicationEndDate &&
          new Date(notif.publicationEndDate) < now
        ) {
          return false;
        }

        return true;
      })
      .map((notif) => {
        let isRead = false;
        if (userId) {
          // Check notificationReads table
          const readRecord = state.notificationReads.find(
            (nr) => nr.notificationId === notif.id && nr.userId === userId,
          );
          if (readRecord) {
            isRead = true;
          } else if (notif.isRead && notif.merchantId) {
            // Fallback to legacy isRead for specific merchant notifications if no read record exists
            // This handles the case where we haven't migrated old data to notificationReads yet
            isRead = true;
          }
        } else {
          // If no userId provided, fall back to legacy isRead or false
          isRead = !!notif.isRead;
        }

        return { ...notif, isRead };
      })
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt).getTime();
        return dateB - dateA;
      });
  },

  markNotificationAsRead: (notificationId, userId) => {
    const state = get();
    const alreadyRead = state.notificationReads.some(
      (nr) => nr.notificationId === notificationId && nr.userId === userId,
    );

    if (!alreadyRead) {
      const newRead: NotificationRead = {
        id: `nr_${Math.random().toString(36).substr(2, 9)}`,
        notificationId,
        userId,
        readAt: new Date().toISOString(),
      };
      set((state) => ({
        notificationReads: [...state.notificationReads, newRead],
      }));
    }
  },

  getMerchantMembers: (merchantId) => {
    return get().users.filter(
      (user) => user.merchantId === merchantId && !user.deletedAt,
    );
  },

  addMember: (user) => {
    set((state) => ({ users: [user, ...state.users] }));
  },

  updateMember: (userId, data) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...data } : user,
      ),
    }));
  },

  deleteMember: (userId) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, deletedAt: new Date().toISOString() }
          : user,
      ),
    }));
  },

  getMerchantClients: (merchantId) => {
    return get().clients.filter(
      (client) => client.merchantId === merchantId && !client.deletedAt,
    );
  },

  addClient: (client) => {
    set((state) => ({ clients: [client, ...state.clients] }));
  },

  updateClient: (clientId, data) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === clientId ? { ...client, ...data } : client,
      ),
    }));
  },

  deleteClient: (clientId) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === clientId
          ? { ...client, deletedAt: new Date().toISOString() }
          : client,
      ),
    }));
  },

  getMerchantBankAccounts: (merchantId) => {
    return get().bankAccounts.filter(
      (account) => account.merchantId === merchantId && !account.deletedAt,
    );
  },

  addBankAccount: (bankAccount) => {
    set((state) => ({ bankAccounts: [bankAccount, ...state.bankAccounts] }));
  },

  updateBankAccount: (bankAccountId, data) => {
    set((state) => ({
      bankAccounts: state.bankAccounts.map((account) =>
        account.id === bankAccountId ? { ...account, ...data } : account,
      ),
    }));
  },

  deleteBankAccount: (bankAccountId) => {
    set((state) => ({
      bankAccounts: state.bankAccounts.map((account) =>
        account.id === bankAccountId
          ? { ...account, deletedAt: new Date().toISOString() }
          : account,
      ),
    }));
  },

  getMerchantCards: (merchantId) => {
    return get().merchantCards.filter((card) => card.merchantId === merchantId);
  },

  addMerchantCard: (card) => {
    set((state) => ({ merchantCards: [card, ...state.merchantCards] }));
  },

  deleteMerchantCard: (cardId) => {
    set((state) => ({
      merchantCards: state.merchantCards.filter((card) => card.id !== cardId),
    }));
  },

  getMerchantItems: (merchantId) => {
    return get().items.filter(
      (item) => item.merchantId === merchantId && !item.deletedAt,
    );
  },

  addItem: (item) => {
    set((state) => ({ items: [item, ...state.items] }));
  },

  updateItem: (itemId, data) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, ...data } : item,
      ),
    }));
  },

  deleteItem: (itemId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, deletedAt: new Date().toISOString() }
          : item,
      ),
    }));
  },

  getDocumentSettings: (merchantId) => {
    return get().documentSettings.find((s) => s.merchantId === merchantId);
  },

  updateDocumentSettings: (merchantId, data) => {
    set((state) => {
      const existing = state.documentSettings.find(
        (s) => s.merchantId === merchantId,
      );
      if (existing) {
        return {
          documentSettings: state.documentSettings.map((s) =>
            s.merchantId === merchantId ? { ...s, ...data } : s,
          ),
        };
      } else {
        // Create new if not exists
        const newSettings: DocumentSettings = {
          merchantId,
          companyName: "", // Default or from merchant name?
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
    return get().invoiceAutoSettings.filter(
      (s) => s.merchantId === merchantId && !s.deletedAt,
    );
  },

  addInvoiceAutoSetting: (setting) => {
    set((state) => ({
      invoiceAutoSettings: [setting, ...state.invoiceAutoSettings],
    }));
  },

  updateInvoiceAutoSetting: (id, data) => {
    set((state) => ({
      invoiceAutoSettings: state.invoiceAutoSettings.map((s) =>
        s.id === id ? { ...s, ...data } : s,
      ),
    }));
  },

  deleteInvoiceAutoSetting: (id) => {
    set((state) => ({
      invoiceAutoSettings: state.invoiceAutoSettings.map((s) =>
        s.id === id ? { ...s, deletedAt: new Date().toISOString() } : s,
      ),
    }));
  },

  // Templates
  getMerchantInvoiceTemplates: (merchantId) => {
    return get().invoiceTemplates.filter((t) => t.merchantId === merchantId);
  },

  addInvoiceTemplate: (template) => {
    set((state) => ({
      invoiceTemplates: [template, ...state.invoiceTemplates],
    }));
  },

  updateInvoiceTemplate: (id, data) => {
    set((state) => ({
      invoiceTemplates: state.invoiceTemplates.map((t) =>
        t.id === id ? { ...t, ...data } : t,
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
    return get().quotations.filter(
      (q) => q.merchantId === merchantId && !q.deletedAt,
    );
  },

  addQuotation: (quotation) => {
    set((state) => ({ quotations: [quotation, ...state.quotations] }));
  },

  updateQuotation: (id, data) => {
    set((state) => ({
      quotations: state.quotations.map((q) =>
        q.id === id ? { ...q, ...data } : q,
      ),
    }));
  },

  deleteQuotation: (id) => {
    set((state) => ({
      quotations: state.quotations.map((q) =>
        q.id === id ? { ...q, deletedAt: new Date().toISOString() } : q,
      ),
    }));
  },

  // Purchase Orders
  getMerchantPurchaseOrders: (merchantId) => {
    return get().purchaseOrders.filter(
      (po) => po.merchantId === merchantId && !po.deletedAt,
    );
  },

  addPurchaseOrder: (purchaseOrder) => {
    set((state) => ({
      purchaseOrders: [purchaseOrder, ...state.purchaseOrders],
    }));
  },

  updatePurchaseOrder: (id, data) => {
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === id ? { ...po, ...data } : po,
      ),
    }));
  },

  deletePurchaseOrder: (id) => {
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === id ? { ...po, deletedAt: new Date().toISOString() } : po,
      ),
    }));
  },

  // Delivery Notes
  getMerchantDeliveryNotes: (merchantId) => {
    return get().deliveryNotes.filter(
      (dn) => dn.merchantId === merchantId && !dn.deletedAt,
    );
  },

  addDeliveryNote: (deliveryNoteData) => {
    const newDeliveryNote: DeliveryNote = {
      ...deliveryNoteData,
      id: `dn_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    } as DeliveryNote;
    set((state) => ({
      deliveryNotes: [newDeliveryNote, ...state.deliveryNotes],
    }));
  },

  updateDeliveryNote: (id, data) => {
    set((state) => ({
      deliveryNotes: state.deliveryNotes.map((dn) =>
        dn.id === id ? { ...dn, ...data } : dn,
      ),
    }));
  },

  deleteDeliveryNote: (id) => {
    set((state) => ({
      deliveryNotes: state.deliveryNotes.map((dn) =>
        dn.id === id ? { ...dn, deletedAt: new Date().toISOString() } : dn,
      ),
    }));
  },

  // Receipts
  getMerchantReceipts: (merchantId) => {
    return get().receipts.filter(
      (rc) => rc.merchantId === merchantId && !rc.deletedAt,
    );
  },

  addReceipt: (receipt) => {
    set((state) => ({ receipts: [receipt, ...state.receipts] }));
  },

  updateReceipt: (id, data) => {
    set((state) => ({
      receipts: state.receipts.map((rc) =>
        rc.id === id ? { ...rc, ...data } : rc,
      ),
    }));
  },

  deleteReceipt: (id) => {
    set((state) => ({
      receipts: state.receipts.map((rc) =>
        rc.id === id ? { ...rc, deletedAt: new Date().toISOString() } : rc,
      ),
    }));
  },

  createMerchantSignup: (email) => {
    const token = Math.random().toString(36).substr(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    const newSignup: MerchantSignup = {
      token,
      email,
      isUsed: false,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      merchantSignups: [...state.merchantSignups, newSignup],
    }));

    return token;
  },

  validateSignupToken: (token) => {
    const state = get();
    const signup = state.merchantSignups.find((s) => s.token === token);

    if (!signup) return null;
    if (signup.isUsed) return null;
    if (new Date(signup.expiresAt) < new Date()) return null;

    return signup;
  },

  completeMerchantRegistration: (token, merchantData, userData) => {
    const state = get();
    const signup = state.merchantSignups.find((s) => s.token === token);

    if (!signup || signup.isUsed) return;

    const merchantId = `u_${Math.random().toString(36).substr(2, 9)}`;

    const newMerchant: Merchant = {
      id: merchantId,
      name: merchantData.name || "",
      address: merchantData.address,
      phoneNumber: merchantData.phoneNumber,
      invoiceEmail: signup.email,
      enableCreditPayment: false,
      ...merchantData,
    } as Merchant;

    const newUser: User = {
      id: merchantId, // Using same ID for simplicity in this mock
      name: userData.name || "",
      email: signup.email,
      role: "merchant",
      merchantId: merchantId,
      memberRole: "owner",
      status: "active",
      createdAt: new Date().toISOString(),
      ...userData,
    } as User;

    set((state) => ({
      merchants: [...state.merchants, newMerchant],
      users: [...state.users, newUser],
      merchantSignups: state.merchantSignups.map((s) =>
        s.token === token ? { ...s, isUsed: true } : s,
      ),
    }));
  },

  getInvoiceById: (id) => {
    return get().invoices.find((inv) => inv.id === id);
  },

  processPayment: async (invoiceId, cardData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const state = get();
    const invoice = state.invoices.find((inv) => inv.id === invoiceId);

    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    const maybeCard = cardData as { cardNumber?: unknown };
    const cardNumber =
      typeof maybeCard.cardNumber === "string" ? maybeCard.cardNumber : "";

    // Mock validation
    if (cardNumber === "0000000000000000") {
      return { success: false, error: "Card declined" };
    }

    const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record (using existing Payment type for internal consistency)
    const newPayment: Payment = {
      id: `pay_${Math.random().toString(36).substr(2, 9)}`,
      invoiceId,
      merchantId: invoice.merchantId,
      amount: invoice.amount,
      fee: invoice.amount * 0.03, // 3% fee
      totalAmount: invoice.amount * 1.03,
      status: "settled",
      paymentMethod: `Credit Card (**** ${cardNumber.slice(-4)})`,
      createdAt: new Date().toISOString().split("T")[0],
      settledAt: new Date().toISOString().split("T")[0],
    };

    // Update invoice status
    set((state) => ({
      payments: [...state.payments, newPayment],
      invoices: state.invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "paid" } : inv,
      ),
    }));

    return { success: true, transactionId };
  },

  getTransactionByInvoiceId: (invoiceId) => {
    // In this mock, we'll look up the Payment record which serves as the transaction
    // In a real system, Transaction and Payment might be separate entities
    const payment = get().payments.find(
      (p) => p.invoiceId === invoiceId && p.status === "settled",
    );

    if (!payment) return undefined;

    // Map Payment to Transaction interface
    return {
      id: payment.id,
      merchantId: payment.merchantId,
      invoiceId: payment.invoiceId,
      type: "payment",
      amount: payment.amount,
      currency: "USD", // Assuming USD for now
      status: "captured",
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt,
      updatedAt: payment.settledAt,
    };
  },
}));
