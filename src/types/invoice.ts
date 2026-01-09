export type InvoiceStatus =
  | "draft"
  | "pending"
  | "approved"
  | "paid"
  | "rejected"
  | "void"
  | "past_due"
  | "open";
export type InvoiceItem = {
  id: string;
  invoiceId: string;
  itemId?: string;
  name: string;
  transactionDate?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  taxId: string;
  withholdingTax?: boolean;
  amount: number;
};

export type Invoice = {
  id: string;
  merchantId: string;
  clientId: string;
  honorific?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  subject?: string;
  direction: "receivable" | "payable";
  paymentMethod?: string;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  notes?: string;
  items: InvoiceItem[];
  bankAccountId?: string;
  remark?: string;
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
};
export type InvoiceAutoIssuanceStatus = "enabled" | "disabled";

export type InvoiceAutoIssuance = {
  id: string;
  merchantId: string;
  targetClient: string;
  scheduleName: string;
  issuanceFrequency: string;
  intervalValue: number;
  nextIssuanceDate: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ReceivedPayableInvoiceAutoIssuance = {
  id: string;
  settingName: string;
  targetClient: string;
  issuanceCycle: "daily" | "weekly" | "monthly";
  nextIssuanceDate: string;
  status: "enabled" | "disabled";
  direction: "receivable" | "payable";
  template: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
};
