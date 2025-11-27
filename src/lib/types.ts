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

export type InvoiceStatus = 'pending' | 'approved' | 'paid' | 'rejected';

export interface Invoice {
    id: string;
    merchantId: string;
    recipientName: string;
    recipientBank: string;
    accountNumber: string;
    amount: number;
    currency: string;
    status: InvoiceStatus;
    dueDate: string;
    createdAt: string;
    fileUrl?: string;
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
    merchantId: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    isRead: boolean;
    createdAt: string;
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
