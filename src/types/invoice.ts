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
  quantity: number;
  unitPrice: number;
  taxId: string;
  amount: number;
};

export type Invoice = {
  id: string;
  merchantId: string;
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  direction: "receivable" | "payable";
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
