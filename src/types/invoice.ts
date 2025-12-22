export type InvoiceStatus =
  | "draft"
  | "pending"
  | "approved"
  | "paid"
  | "rejected"
  | "void";

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
