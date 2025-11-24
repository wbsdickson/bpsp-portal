export type UserRole = 'merchant' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
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
