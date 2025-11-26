import { User, Invoice, Payment, Notification } from './types';

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Alice Merchant',
        email: 'alice@techcorp.com',
        role: 'merchant',
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
        companyName: 'BPSP Global',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        status: 'active'
    },
    {
        id: 'u3',
        name: 'Charlie Merchant',
        email: 'charlie@retail.com',
        role: 'merchant',
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
        companyName: 'JPCC Global',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        status: 'active'
    },
    {
        id: 'u5',
        name: 'Eve JPCC Merchant',
        email: 'eve@hybrid.com',
        role: 'merchant_jpcc',
        companyName: 'Hybrid Corp',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve',
        status: 'active',
        customFeePercentage: 1.8
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
