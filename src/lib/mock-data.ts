import { User, Invoice, Payment, Notification, Merchant, Client, BankAccount, MerchantCard, Tax } from './types';

export const MOCK_MERCHANTS: Merchant[] = [
    // ...existing code...

    {
        id: 'u1', // Linking to user ID for simplicity in this mock
        name: 'TechCorp Solutions',
        address: '123 Tech Blvd, San Francisco, CA 94105',
        phoneNumber: '555-0101',
        invoiceEmail: 'billing@techcorp.com',
        websiteUrl: 'https://techcorp.com',
        invoicePrefix: 'TC-',
        enableCreditPayment: true,
        defaultTaxId: 'tax_10',
    },
    {
        id: 'u3',
        name: 'Retail Giants',
        address: '456 Market St, New York, NY 10001',
        phoneNumber: '555-0102',
        invoiceEmail: 'accounts@retailgiants.com',
        websiteUrl: 'https://retailgiants.com',
        invoicePrefix: 'RG-',
        enableCreditPayment: false,
        defaultTaxId: 'tax_10',
    },
    {
        id: 'u5',
        name: 'Hybrid Corp',
        address: '789 Innovation Dr, Austin, TX 78701',
        phoneNumber: '555-0103',
        invoiceEmail: 'finance@hybrid.com',
        websiteUrl: 'https://hybrid.com',
        invoicePrefix: 'HY-',
        enableCreditPayment: true,
        defaultTaxId: 'tax_08',
    }
];

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Alice Merchant',
        email: 'alice@techcorp.com',
        role: 'merchant',
        merchantId: 'u1',
        memberRole: 'owner',
        lastLoginAt: '2023-11-26T09:00:00Z',
        companyName: 'TechCorp Solutions',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        status: 'active',
        customFeePercentage: 2.0
    },
    {
        id: 'u2',
        name: 'Bob Admin',
        email: 'bob@bpsp.com',
        role: 'admin',
        lastLoginAt: '2023-11-26T08:30:00Z',
        companyName: 'BPSP Global',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        status: 'active'
    },
    {
        id: 'u3',
        name: 'Charlie Merchant',
        email: 'charlie@retail.com',
        role: 'merchant',
        merchantId: 'u3',
        memberRole: 'owner',
        lastLoginAt: '2023-11-25T14:00:00Z',
        companyName: 'Retail Giants',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
        status: 'active',
        customFeePercentage: 2.5
    },
    {
        id: 'u4',
        name: 'David JPCC Admin',
        email: 'david@jpcc.com',
        role: 'jpcc_admin',
        lastLoginAt: '2023-11-26T10:15:00Z',
        companyName: 'JPCC Global',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        status: 'active'
    },
    {
        id: 'u5',
        name: 'Eve JPCC Merchant',
        email: 'eve@hybrid.com',
        role: 'merchant_jpcc',
        merchantId: 'u5',
        memberRole: 'owner',
        lastLoginAt: '2023-11-24T16:45:00Z',
        companyName: 'Hybrid Corp',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve',
        status: 'active',
        customFeePercentage: 1.8
    },
    // New members for TechCorp (u1)
    {
        id: 'u6',
        name: 'Frank Staff',
        email: 'frank@techcorp.com',
        role: 'merchant',
        merchantId: 'u1',
        memberRole: 'staff',
        lastLoginAt: '2023-11-20T11:00:00Z',
        companyName: 'TechCorp Solutions',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank',
        status: 'active'
    },
    {
        id: 'u7',
        name: 'Grace Viewer',
        email: 'grace@techcorp.com',
        role: 'merchant',
        merchantId: 'u1',
        memberRole: 'viewer',
        lastLoginAt: '2023-11-18T09:30:00Z',
        companyName: 'TechCorp Solutions',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
        status: 'active'
    },
    {
        id: 'u8',
        name: 'Hank Deleted',
        email: 'hank@techcorp.com',
        role: 'merchant',
        merchantId: 'u1',
        memberRole: 'staff',
        lastLoginAt: '2023-10-01T10:00:00Z',
        deletedAt: '2023-11-01T12:00:00Z',
        companyName: 'TechCorp Solutions',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hank',
        status: 'active'
    }
];

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 'inv_001',
        merchantId: 'u1',
        recipientName: 'Cloud Services Inc.',
        recipientBank: 'Silicon Valley Bank',
        accountNumber: '1234567890',
        amount: 5000,
        currency: 'USD',
        status: 'pending',
        dueDate: '2023-12-01',
        createdAt: '2023-11-20'
    },
    {
        id: 'inv_002',
        merchantId: 'u1',
        recipientName: 'Office Supplies Co.',
        recipientBank: 'Chase Bank',
        accountNumber: '0987654321',
        amount: 1200,
        currency: 'USD',
        status: 'approved',
        dueDate: '2023-11-25',
        createdAt: '2023-11-15'
    },
    {
        id: 'inv_003',
        merchantId: 'u1',
        recipientName: 'Marketing Agency',
        recipientBank: 'Wells Fargo',
        accountNumber: '1122334455',
        amount: 3500,
        currency: 'USD',
        status: 'paid',
        dueDate: '2023-11-10',
        createdAt: '2023-11-01'
    },
    {
        id: 'inv_004',
        merchantId: 'u3',
        recipientName: 'Logistics Partner',
        recipientBank: 'Bank of America',
        accountNumber: '5566778899',
        amount: 8000,
        currency: 'USD',
        status: 'pending',
        dueDate: '2023-12-05',
        createdAt: '2023-11-22'
    }
];

export const MOCK_PAYMENTS: Payment[] = [
    {
        id: 'pay_001',
        invoiceId: 'inv_003',
        merchantId: 'u1',
        amount: 3500,
        fee: 70, // 2% fee
        totalAmount: 3570,
        status: 'settled',
        paymentMethod: 'Credit Card (**** 4242)',
        createdAt: '2023-11-09',
        settledAt: '2023-11-11'
    },
    {
        id: 'pay_002',
        invoiceId: 'inv_002',
        merchantId: 'u1',
        amount: 1200,
        fee: 24,
        totalAmount: 1224,
        status: 'pending_approval',
        paymentMethod: 'Bank Transfer',
        createdAt: '2023-11-26'
    },
    {
        id: 'pay_003',
        invoiceId: 'inv_004',
        merchantId: 'u3',
        amount: 8000,
        fee: 200, // 2.5% fee for u3
        totalAmount: 8200,
        status: 'settled',
        paymentMethod: 'Credit Card (**** 8888)',
        createdAt: '2023-11-25'
    },
    {
        id: 'pay_004',
        invoiceId: 'inv_001',
        merchantId: 'u1',
        amount: 5000,
        fee: 100,
        totalAmount: 5100,
        status: 'failed',
        paymentMethod: 'Bank Transfer',
        createdAt: '2023-11-24'
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif_001',
        merchantId: 'u1',
        title: 'Payment Successful',
        message: 'Your payment for Invoice #inv_003 has been successfully processed.',
        type: 'success',
        isRead: false,
        createdAt: '2023-11-11T10:00:00Z'
    },
    {
        id: 'notif_002',
        merchantId: 'u1',
        title: 'Invoice Approved',
        message: 'Invoice #inv_002 has been approved and is ready for payment.',
        type: 'info',
        isRead: true,
        createdAt: '2023-11-26T09:30:00Z'
    },
    {
        id: 'notif_003',
        merchantId: 'u1',
        title: 'Payment Failed',
        message: 'Payment for Invoice #inv_001 failed. Please check your payment method.',
        type: 'error',
        isRead: false,
        createdAt: '2023-11-24T14:15:00Z'
    },
    {
        id: 'notif_004',
        merchantId: 'u1',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Nov 30th from 2 AM to 4 AM.',
        type: 'warning',
        isRead: false,
        createdAt: '2023-11-20T08:00:00Z'
    },
    {
        id: 'notif_005',
        merchantId: 'u3',
        title: 'Welcome',
        message: 'Welcome to BPSP Portal!',
        type: 'info',
        isRead: true,
        createdAt: '2023-11-22T10:00:00Z'
    }
];

export const MOCK_CLIENTS: Client[] = [
    {
        id: 'c1',
        merchantId: 'u1',
        name: 'Acme Corp',
        email: 'contact@acme.com',
        phoneNumber: '555-1001',
        address: '100 Industrial Way, Gotham City',
        createdAt: '2023-11-01T10:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'c2',
        merchantId: 'u1',
        name: 'Wayne Enterprises',
        email: 'bruce@wayne.com',
        phoneNumber: '555-1002',
        address: '1007 Mountain Drive, Gotham City',
        createdAt: '2023-11-05T14:30:00Z',
        createdBy: 'u1'
    },
    {
        id: 'c3',
        merchantId: 'u1',
        name: 'Stark Industries',
        email: 'tony@stark.com',
        phoneNumber: '555-1003',
        address: '10880 Malibu Point, Malibu',
        createdAt: '2023-11-10T09:15:00Z',
        createdBy: 'u1'
    },
    {
        id: 'c4',
        merchantId: 'u1',
        name: 'Deleted Client',
        email: 'deleted@client.com',
        phoneNumber: '555-9999',
        address: 'Nowhere',
        createdAt: '2023-10-01T10:00:00Z',
        deletedAt: '2023-11-01T12:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'c5',
        merchantId: 'u3',
        name: 'LexCorp',
        email: 'lex@lexcorp.com',
        phoneNumber: '555-2001',
        address: 'Metropolis',
        createdAt: '2023-11-15T11:00:00Z',
        createdBy: 'u3'
    }
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
    {
        id: 'ba1',
        merchantId: 'u1',
        bankName: 'Silicon Valley Bank',
        branchName: 'Main Branch',
        accountType: 'checking',
        accountNumber: '1234567',
        accountHolder: 'TechCorp Solutions',
        createdAt: '2023-11-01T10:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'ba2',
        merchantId: 'u1',
        bankName: 'Chase Bank',
        branchName: 'Downtown',
        accountType: 'savings',
        accountNumber: '7654321',
        accountHolder: 'TechCorp Solutions',
        createdAt: '2023-11-05T14:30:00Z',
        createdBy: 'u1'
    },
    {
        id: 'ba3',
        merchantId: 'u1',
        bankName: 'Wells Fargo',
        branchName: 'Uptown',
        accountType: 'checking',
        accountNumber: '1122334',
        accountHolder: 'TechCorp Solutions',
        createdAt: '2023-10-01T10:00:00Z',
        deletedAt: '2023-11-01T12:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'ba4',
        merchantId: 'u3',
        bankName: 'Bank of America',
        branchName: 'NYC Central',
        accountType: 'checking',
        accountNumber: '9988776',
        accountHolder: 'Retail Giants',
        createdAt: '2023-11-15T11:00:00Z',
        createdBy: 'u3'
    }
];

export const MOCK_MERCHANT_CARDS: MerchantCard[] = [
    {
        id: 'mc1',
        merchantId: 'u1',
        cardBrand: 'Visa',
        last4: '4242',
        expiryMonth: '12',
        expiryYear: '2025',
        token: 'tok_visa_123',
        createdAt: '2023-11-01T10:00:00Z'
    },
    {
        id: 'mc2',
        merchantId: 'u1',
        cardBrand: 'MasterCard',
        last4: '8888',
        expiryMonth: '06',
        expiryYear: '2024',
        token: 'tok_master_456',
        createdAt: '2023-11-05T14:30:00Z'
    },
    {
        id: 'mc3',
        merchantId: 'u3',
        cardBrand: 'Amex',
        last4: '0005',
        expiryMonth: '01',
        expiryYear: '2026',
        token: 'tok_amex_789',
        createdAt: '2023-11-15T11:00:00Z'
    }
];

export const MOCK_TAXES: Tax[] = [
    { id: 'tax_10', name: 'Standard Tax (10%)', rate: 0.10, description: 'Standard consumption tax' },
    { id: 'tax_08', name: 'Reduced Tax (8%)', rate: 0.08, description: 'Reduced tax rate for food, etc.' },
    { id: 'tax_00', name: 'Tax Exempt (0%)', rate: 0.00, description: 'Tax exempt items' }
];
