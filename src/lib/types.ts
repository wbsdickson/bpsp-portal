export type UserRole = 'merchant' | 'admin' | 'jpcc_admin' | 'merchant_jpcc';
export type MemberRole = 'owner' | 'staff' | 'viewer';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    merchantId?: string; // Link to Merchant
    memberRole?: MemberRole; // Role within the merchant organization
    lastLoginAt?: string;
    deletedAt?: string | null;
    createdAt?: string;
    avatarUrl?: string;
    companyName?: string;
    status?: 'active' | 'suspended';
    customFeePercentage?: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'approved' | 'paid' | 'rejected' | 'void';

export interface InvoiceItem {
    id: string;
    invoiceId: string;
    itemId?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    taxId: string;
    amount: number;
}

export interface Invoice {
    id: string;
    merchantId: string;
    clientId: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate?: string;
    direction: 'receivable' | 'payable';
    paymentMethod?: string;
    status: InvoiceStatus;
    amount: number;
    currency: string;
    notes?: string;
    items: InvoiceItem[];
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
    fileUrl?: string;

    // Legacy fields (optional for backward compatibility during migration)
    recipientName?: string;
    recipientBank?: string;
    accountNumber?: string;
}

export interface Transaction {
    id: string;
    merchantId: string;
    invoiceId?: string;
    type: 'payment' | 'refund' | 'payout';
    amount: number;
    currency: string;
    status: 'captured' | 'failed' | 'refunded' | 'pending';
    paymentMethod?: string;
    createdAt: string;
    updatedAt?: string;
}

export type PaymentStatus = 'pending_approval' | 'settled' | 'failed';

export interface Payment {
    id: string;
    invoiceId: string;
    merchantId: string;
    amount: number;
    fee: number;
    totalAmount: number;
    status: PaymentStatus;
    paymentMethod: string;
    createdAt: string;
    settledAt?: string;
}

export interface MerchantStats {
    totalSpend: number;
    activeInvoices: number;
    pendingApprovals: number;
}

export interface Notification {
    id: string;
    merchantId?: string; // Optional: If null/undefined, it targets all merchants (subject to targetUserType)
    targetUserType?: 'merchant' | 'admin' | 'all';
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    // isRead is deprecated in favor of NotificationRead for system notifications, 
    // but kept for compatibility with existing transactional notifications if needed.
    isRead?: boolean;
    publicationStartDate?: string;
    publicationEndDate?: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
}

export interface NotificationRead {
    id: string;
    notificationId: string;
    userId: string;
    readAt: string;
}

export interface Merchant {
    id: string;
    name: string;
    address?: string;
    phoneNumber?: string;
    invoiceEmail: string;
    websiteUrl?: string;
    invoicePrefix?: string;
    enableCreditPayment: boolean;
    defaultTaxId?: string;
    updatedBy?: string;
}

export interface Client {
    id: string;
    merchantId: string;
    name: string;
    email: string;
    phoneNumber: string;
    address?: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
}

export interface BankAccount {
    id: string;
    merchantId: string;
    bankName: string;
    branchName?: string;
    accountType: 'savings' | 'checking'; // 'savings' = 普通, 'checking' = 当座
    accountNumber: string;
    accountHolder: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
}

export interface MerchantCard {
    id: string;
    merchantId: string;
    cardBrand: string;
    last4: string;
    expiryMonth: string;
    expiryYear: string;
    token: string;
    createdAt: string;
    updatedBy?: string;
}

export interface Tax {
    id: string;
    name: string;
    rate: number; // e.g., 0.10 for 10%
    description?: string;
}

export interface Item {
    id: string;
    merchantId: string;
    name: string;
    unitPrice?: number;
    taxId: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
}

export interface DocumentSettings {
    merchantId: string;
    companyName: string;
    address?: string;
    phoneNumber?: string;
    representativeName?: string;
    logoUrl?: string;
    footerText?: string;
    updatedBy?: string;
    updatedAt?: string;
}

export interface InvoiceTemplate {
    id: string;
    merchantId: string;
    name: string;
    items: InvoiceItem[];
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface InvoiceAutoSetting {
    id: string;
    merchantId: string;
    scheduleName: string;
    clientId: string;
    intervalType: 'daily' | 'weekly' | 'monthly' | 'yearly';
    intervalValue: number;
    nextIssuanceDate: string;
    startDate?: string;
    endDate?: string;
    templateId: string;
    direction: 'receivable' | 'payable';
    enabled: boolean;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface QuotationItem {
    id: string;
    quotationId: string;
    itemId?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    taxId: string;
    amount: number;
}

export interface Quotation {
    id: string;
    merchantId: string;
    clientId: string;
    quotationNumber: string;
    quotationDate: string;
    status: QuotationStatus;
    amount: number;
    currency: string;
    notes?: string;
    items: QuotationItem[];
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
}

export type PurchaseOrderStatus = 'draft' | 'issued';

export interface PurchaseOrderItem {
    id: string;
    purchaseOrderId: string;
    itemId?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    taxId: string;
    amount: number;
}

export interface PurchaseOrder {
    id: string;
    merchantId: string;
    clientId: string;
    poNumber: string;
    poDate: string;
    status: PurchaseOrderStatus;
    amount: number;
    currency: string;
    notes?: string;
    items: PurchaseOrderItem[];
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
}

export type DeliveryNoteStatus = 'draft' | 'issued';

export interface DeliveryNoteItem {
    id: string;
    deliveryNoteId: string;
    itemId?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    taxId: string;
    amount: number;
}

export interface DeliveryNote {
    id: string;
    merchantId: string;
    clientId: string;
    deliveryNoteNumber: string;
    deliveryDate: string;
    status: DeliveryNoteStatus;
    amount: number;
    currency: string;
    notes?: string;
    items: DeliveryNoteItem[];
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
}

export type ReceiptStatus = 'draft' | 'issued';

export interface ReceiptItem {
    id: string;
    receiptId: string;
    itemId?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    taxId: string;
    amount: number;
}

export interface Receipt {
    id: string;
    merchantId: string;
    clientId: string;
    receiptNumber: string;
    issueDate: string;
    status: ReceiptStatus;
    amount: number;
    currency: string;
    notes?: string;
    items: ReceiptItem[];
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
}

export interface MerchantSignup {
    token: string;
    email: string;
    isUsed: boolean;
    expiresAt: string;
    createdAt: string;
}
