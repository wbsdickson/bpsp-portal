import { User, Invoice, Payment, Notification, Merchant, Client, BankAccount, MerchantCard, Tax, Item, DocumentSettings, InvoiceAutoSetting, InvoiceTemplate, Quotation, PurchaseOrder, DeliveryNote, Receipt } from './types';

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
        clientId: 'c1',
        invoiceNumber: 'TC-0001',
        invoiceDate: '2023-11-20',
        dueDate: '2023-12-01',
        status: 'pending',
        amount: 5000,
        currency: 'USD',
        items: [
            {
                id: 'ii_1',
                invoiceId: 'inv_001',
                name: 'Cloud Hosting',
                quantity: 1,
                unitPrice: 5000,
                taxId: 'tax_10',
                amount: 5000
            }
        ],
        createdAt: '2023-11-20',
        createdBy: 'u1',
        recipientName: 'Cloud Services Inc.',
        recipientBank: 'Silicon Valley Bank',
        accountNumber: '1234567890'
    },
    {
        id: 'inv_002',
        merchantId: 'u1',
        clientId: 'c2',
        invoiceNumber: 'TC-0002',
        invoiceDate: '2023-11-15',
        dueDate: '2023-11-25',
        status: 'approved',
        amount: 1200,
        currency: 'USD',
        items: [
            {
                id: 'ii_2',
                invoiceId: 'inv_002',
                name: 'Office Supplies',
                quantity: 1,
                unitPrice: 1200,
                taxId: 'tax_10',
                amount: 1200
            }
        ],
        createdAt: '2023-11-15',
        createdBy: 'u1',
        recipientName: 'Office Supplies Co.',
        recipientBank: 'Chase Bank',
        accountNumber: '0987654321'
    },
    {
        id: 'inv_003',
        merchantId: 'u1',
        clientId: 'c3',
        invoiceNumber: 'TC-0003',
        invoiceDate: '2023-11-01',
        dueDate: '2023-11-10',
        status: 'paid',
        amount: 3500,
        currency: 'USD',
        items: [
            {
                id: 'ii_3',
                invoiceId: 'inv_003',
                name: 'Marketing Services',
                quantity: 1,
                unitPrice: 3500,
                taxId: 'tax_10',
                amount: 3500
            }
        ],
        createdAt: '2023-11-01',
        createdBy: 'u1',
        recipientName: 'Marketing Agency',
        recipientBank: 'Wells Fargo',
        accountNumber: '1122334455'
    },
    {
        id: 'inv_004',
        merchantId: 'u3',
        clientId: 'c5',
        invoiceNumber: 'RG-0001',
        invoiceDate: '2023-11-22',
        dueDate: '2023-12-05',
        status: 'pending',
        amount: 8000,
        currency: 'USD',
        items: [
            {
                id: 'ii_4',
                invoiceId: 'inv_004',
                name: 'Logistics',
                quantity: 1,
                unitPrice: 8000,
                taxId: 'tax_10',
                amount: 8000
            }
        ],
        createdAt: '2023-11-22',
        createdBy: 'u3',
        recipientName: 'Logistics Partner',
        recipientBank: 'Bank of America',
        accountNumber: '5566778899'
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
    },
    {
        id: 'c6',
        merchantId: 'u1',
        name: 'Global Tech Partners',
        email: 'partners@globaltech.com',
        phoneNumber: '555-3001',
        address: '500 Tech Park, San Jose, CA',
        createdAt: '2023-11-20T10:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'c7',
        merchantId: 'u1',
        name: 'Local Coffee Shop',
        email: 'manager@localcoffee.com',
        phoneNumber: '555-3002',
        address: '123 Main St, San Francisco, CA',
        createdAt: '2023-11-21T11:00:00Z',
        createdBy: 'u1'
    },
    // Eve's Clients
    {
        id: 'c8',
        merchantId: 'u5',
        name: 'Global Innovations',
        email: 'contact@globalinnovations.com',
        phoneNumber: '555-4001',
        address: '789 Tech Park, Austin, TX',
        createdAt: '2023-11-22T09:00:00Z',
        createdBy: 'u5'
    },
    {
        id: 'c9',
        merchantId: 'u5',
        name: 'Future Tech',
        email: 'info@futuretech.com',
        phoneNumber: '555-4002',
        address: '456 Future Way, Austin, TX',
        createdAt: '2023-11-23T10:00:00Z',
        createdBy: 'u5'
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

export const MOCK_ITEMS: Item[] = [
    {
        id: 'item_1',
        merchantId: 'u1',
        name: 'Web Hosting (Basic)',
        unitPrice: 1000,
        taxId: 'tax_10',
        createdAt: '2023-11-01T10:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'item_2',
        merchantId: 'u1',
        name: 'Domain Registration',
        unitPrice: 1500,
        taxId: 'tax_10',
        createdAt: '2023-11-05T14:30:00Z',
        createdBy: 'u1'
    },
    {
        id: 'item_3',
        merchantId: 'u1',
        name: 'SSL Certificate',
        unitPrice: 5000,
        taxId: 'tax_10',
        createdAt: '2023-11-10T09:15:00Z',
        createdBy: 'u1'
    },
    {
        id: 'item_4',
        merchantId: 'u1',
        name: 'Consulting Service',
        unitPrice: 10000,
        taxId: 'tax_10',
        createdAt: '2023-10-01T10:00:00Z',
        deletedAt: '2023-11-01T12:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'item_5',
        merchantId: 'u3',
        name: 'T-Shirt',
        unitPrice: 2500,
        taxId: 'tax_10',
        createdAt: '2023-11-15T11:00:00Z',
        createdBy: 'u3'
    },
    {
        id: 'item_6',
        merchantId: 'u1',
        name: 'Premium Support Package',
        unitPrice: 2000,
        taxId: 'tax_10',
        createdAt: '2023-11-20T10:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'item_7',
        merchantId: 'u1',
        name: 'On-site Training (Day)',
        unitPrice: 15000,
        taxId: 'tax_10',
        createdAt: '2023-11-21T11:00:00Z',
        createdBy: 'u1'
    },
    // Eve's Items
    {
        id: 'item_8',
        merchantId: 'u5',
        name: 'Consulting Hour',
        unitPrice: 200,
        taxId: 'tax_10',
        createdAt: '2023-11-22T09:00:00Z',
        createdBy: 'u5'
    },
    {
        id: 'item_9',
        merchantId: 'u5',
        name: 'Software License',
        unitPrice: 5000,
        taxId: 'tax_10',
        createdAt: '2023-11-23T10:00:00Z',
        createdBy: 'u5'
    }
];

export const MOCK_DOCUMENT_SETTINGS: DocumentSettings[] = [
    {
        merchantId: 'u1',
        companyName: 'TechCorp Solutions',
        address: '123 Tech Blvd, San Francisco, CA 94105',
        phoneNumber: '555-0101',
        representativeName: 'Alice Merchant',
        footerText: 'Thank you for your business!',
        updatedAt: '2023-11-01T10:00:00Z',
        updatedBy: 'u1'
    },
    {
        merchantId: 'u3',
        companyName: 'Retail Giants',
        address: '456 Market St, New York, NY 10001',
        phoneNumber: '555-0102',
        representativeName: 'Charlie Merchant',
        footerText: 'Please pay within 30 days.',
        updatedAt: '2023-11-15T11:00:00Z',
        updatedBy: 'u3'
    }
];

export const MOCK_INVOICE_TEMPLATES: InvoiceTemplate[] = [
    {
        id: 'tpl_1',
        merchantId: 'u1',
        name: 'Standard Service Template',
        items: [
            {
                id: 'ti_1',
                invoiceId: 'tpl_1',
                name: 'Monthly Service Fee',
                quantity: 1,
                unitPrice: 5000,
                taxId: 'tax_10',
                amount: 5000
            }
        ],
        notes: 'Thank you for your business.',
        createdAt: '2023-11-01T10:00:00Z'
    },
    {
        id: 'tpl_2',
        merchantId: 'u1',
        name: 'Consulting Template',
        items: [
            {
                id: 'ti_2',
                invoiceId: 'tpl_2',
                name: 'Consulting Hours',
                quantity: 10,
                unitPrice: 150,
                taxId: 'tax_10',
                amount: 1500
            }
        ],
        notes: 'Payment due within 14 days.',
        createdAt: '2023-11-05T14:30:00Z'
    },
    {
        id: 'tpl_3',
        merchantId: 'u1',
        name: 'Web Development Project',
        items: [
            {
                id: 'ti_3',
                invoiceId: 'tpl_3',
                name: 'Frontend Development',
                quantity: 40,
                unitPrice: 100,
                taxId: 'tax_10',
                amount: 4000
            },
            {
                id: 'ti_4',
                invoiceId: 'tpl_3',
                name: 'Backend Development',
                quantity: 40,
                unitPrice: 120,
                taxId: 'tax_10',
                amount: 4800
            }
        ],
        notes: 'Milestone payment for development phase.',
        createdAt: '2023-11-20T10:00:00Z'
    },
    {
        id: 'tpl_4',
        merchantId: 'u1',
        name: 'Maintenance Retainer',
        items: [
            {
                id: 'ti_5',
                invoiceId: 'tpl_4',
                name: 'Monthly Maintenance',
                quantity: 1,
                unitPrice: 2000,
                taxId: 'tax_10',
                amount: 2000
            }
        ],
        notes: 'Includes up to 10 hours of support.',
        createdAt: '2023-11-21T11:00:00Z'
    },
    // Eve's Templates
    {
        id: 'tpl_5',
        merchantId: 'u5',
        name: 'Retainer Template',
        items: [
            {
                id: 'ti_6',
                invoiceId: 'tpl_5',
                name: 'Monthly Retainer Fee',
                quantity: 1,
                unitPrice: 2000,
                taxId: 'tax_10',
                amount: 2000
            }
        ],
        notes: 'Monthly retainer.',
        createdAt: '2023-11-22T09:00:00Z'
    }
];

export const MOCK_INVOICE_AUTO_SETTINGS: InvoiceAutoSetting[] = [
    {
        id: 'auto_1',
        merchantId: 'u1',
        scheduleName: 'Monthly Hosting Bill',
        clientId: 'c1',
        intervalType: 'monthly',
        intervalValue: 1,
        nextIssuanceDate: '2023-12-01',
        startDate: '2023-11-01',
        templateId: 'tpl_1',
        enabled: true,
        createdAt: '2023-11-01T10:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'auto_2',
        merchantId: 'u1',
        scheduleName: 'Weekly Maintenance',
        clientId: 'c2',
        intervalType: 'weekly',
        intervalValue: 1,
        nextIssuanceDate: '2023-11-27',
        startDate: '2023-11-01',
        endDate: '2024-11-01',
        templateId: 'tpl_2',
        enabled: false,
        createdAt: '2023-11-05T14:30:00Z',
        createdBy: 'u1'
    },
    // Eve's Auto Settings
    {
        id: 'auto_3',
        merchantId: 'u5',
        scheduleName: 'Monthly Retainer',
        clientId: 'c8',
        intervalType: 'monthly',
        intervalValue: 1,
        nextIssuanceDate: '2023-12-01',
        startDate: '2023-11-01',
        templateId: 'tpl_5',
        enabled: true,
        createdAt: '2023-11-22T09:00:00Z',
        createdBy: 'u5'
    }
];

export const MOCK_QUOTATIONS: Quotation[] = [
    {
        id: 'qt_001',
        merchantId: 'u1',
        clientId: 'c1',
        quotationNumber: 'QT-0001',
        quotationDate: '2023-11-25',
        status: 'draft',
        amount: 15000,
        currency: 'USD',
        items: [
            {
                id: 'qi_1',
                quotationId: 'qt_001',
                name: 'Custom Software Development',
                quantity: 1,
                unitPrice: 15000,
                taxId: 'tax_10',
                amount: 15000
            }
        ],
        createdAt: '2023-11-25T10:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'qt_002',
        merchantId: 'u1',
        clientId: 'c2',
        quotationNumber: 'QT-0002',
        quotationDate: '2023-11-26',
        status: 'sent',
        amount: 5000,
        currency: 'USD',
        items: [
            {
                id: 'qi_2',
                quotationId: 'qt_002',
                name: 'Annual Maintenance Contract',
                quantity: 1,
                unitPrice: 5000,
                taxId: 'tax_10',
                amount: 5000
            }
        ],
        createdAt: '2023-11-26T14:00:00Z',
        createdBy: 'u1'
    },
    // Eve's Quotations
    {
        id: 'qt_003',
        merchantId: 'u5',
        clientId: 'c9',
        quotationNumber: 'QT-1001',
        quotationDate: '2023-11-27',
        status: 'sent',
        amount: 10000,
        currency: 'USD',
        items: [
            {
                id: 'qi_3',
                quotationId: 'qt_003',
                name: 'Project Proposal',
                quantity: 1,
                unitPrice: 10000,
                taxId: 'tax_10',
                amount: 10000
            }
        ],
        createdAt: '2023-11-27T10:00:00Z',
        createdBy: 'u5'
    }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
    {
        id: 'po_001',
        merchantId: 'u1',
        clientId: 'c1',
        poNumber: 'PO-0001',
        poDate: '2023-11-28',
        status: 'draft',
        amount: 2000,
        currency: 'USD',
        items: [
            {
                id: 'poi_1',
                purchaseOrderId: 'po_001',
                name: 'Office Equipment',
                quantity: 2,
                unitPrice: 1000,
                taxId: 'tax_10',
                amount: 2000
            }
        ],
        createdAt: '2023-11-28T09:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'po_002',
        merchantId: 'u1',
        clientId: 'c2',
        poNumber: 'PO-0002',
        poDate: '2023-11-29',
        status: 'issued',
        amount: 5000,
        currency: 'USD',
        items: [
            {
                id: 'poi_2',
                purchaseOrderId: 'po_002',
                name: 'Server Hardware',
                quantity: 1,
                unitPrice: 5000,
                taxId: 'tax_10',
                amount: 5000
            }
        ],
        createdAt: '2023-11-29T10:00:00Z',
        createdBy: 'u1'
    },
    // Eve's Purchase Orders
    {
        id: 'po_003',
        merchantId: 'u5',
        clientId: 'c8',
        poNumber: 'PO-1001',
        poDate: '2023-11-30',
        status: 'issued',
        amount: 3000,
        currency: 'USD',
        items: [
            {
                id: 'poi_3',
                purchaseOrderId: 'po_003',
                name: 'Consulting Services',
                quantity: 15,
                unitPrice: 200,
                taxId: 'tax_10',
                amount: 3000
            }
        ],
        createdAt: '2023-11-30T11:00:00Z',
        createdBy: 'u5'
    }
];

export const MOCK_DELIVERY_NOTES: DeliveryNote[] = [
    {
        id: 'dn_001',
        merchantId: 'u1',
        clientId: 'c1',
        deliveryNoteNumber: 'DN-0001',
        deliveryDate: '2023-12-01',
        status: 'draft',
        amount: 2000,
        currency: 'USD',
        items: [
            {
                id: 'dni_1',
                deliveryNoteId: 'dn_001',
                name: 'Office Equipment',
                quantity: 2,
                unitPrice: 1000,
                taxId: 'tax_10',
                amount: 2000
            }
        ],
        createdAt: '2023-12-01T09:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'dn_002',
        merchantId: 'u1',
        clientId: 'c2',
        deliveryNoteNumber: 'DN-0002',
        deliveryDate: '2023-12-02',
        status: 'issued',
        amount: 5000,
        currency: 'USD',
        items: [
            {
                id: 'dni_2',
                deliveryNoteId: 'dn_002',
                name: 'Server Hardware',
                quantity: 1,
                unitPrice: 5000,
                taxId: 'tax_10',
                amount: 5000
            }
        ],
        createdAt: '2023-12-02T10:00:00Z',
        createdBy: 'u1'
    },
    // Eve's Delivery Notes
    {
        id: 'dn_003',
        merchantId: 'u5',
        clientId: 'c8',
        deliveryNoteNumber: 'DN-1001',
        deliveryDate: '2023-12-03',
        status: 'issued',
        amount: 3000,
        currency: 'USD',
        items: [
            {
                id: 'dni_3',
                deliveryNoteId: 'dn_003',
                name: 'Consulting Services',
                quantity: 15,
                unitPrice: 200,
                taxId: 'tax_10',
                amount: 3000
            }
        ],
        createdAt: '2023-12-03T11:00:00Z',
        createdBy: 'u5'
    }
];

export const MOCK_RECEIPTS: Receipt[] = [
    {
        id: 'rc_001',
        merchantId: 'u1',
        clientId: 'c1',
        receiptNumber: 'RC-0001',
        issueDate: '2023-12-05',
        status: 'draft',
        amount: 2000,
        currency: 'USD',
        items: [
            {
                id: 'rci_1',
                receiptId: 'rc_001',
                name: 'Office Equipment',
                quantity: 2,
                unitPrice: 1000,
                taxId: 'tax_10',
                amount: 2000
            }
        ],
        createdAt: '2023-12-05T09:00:00Z',
        createdBy: 'u1'
    },
    {
        id: 'rc_002',
        merchantId: 'u1',
        clientId: 'c2',
        receiptNumber: 'RC-0002',
        issueDate: '2023-12-06',
        status: 'issued',
        amount: 5000,
        currency: 'USD',
        items: [
            {
                id: 'rci_2',
                receiptId: 'rc_002',
                name: 'Server Hardware',
                quantity: 1,
                unitPrice: 5000,
                taxId: 'tax_10',
                amount: 5000
            }
        ],
        createdAt: '2023-12-06T10:00:00Z',
        createdBy: 'u1'
    },
    // Eve's Receipts
    {
        id: 'rc_003',
        merchantId: 'u5',
        clientId: 'c8',
        receiptNumber: 'RC-1001',
        issueDate: '2023-12-07',
        status: 'issued',
        amount: 3000,
        currency: 'USD',
        items: [
            {
                id: 'rci_3',
                receiptId: 'rc_003',
                name: 'Consulting Services',
                quantity: 15,
                unitPrice: 200,
                taxId: 'tax_10',
                amount: 3000
            }
        ],
        createdAt: '2023-12-07T11:00:00Z',
        createdBy: 'u5'
    }
];
