export enum UserRole {
  Operator = "operator",
  Merchant = "merchant",
}

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  merchantId?: string;
  memberRole?: "owner" | "staff" | "viewer";
  lastLoginAt?: string;
  deletedAt?: string | null;
  createdAt?: string;
  avatarUrl?: string;
  companyName?: string;
  status?: "active" | "suspended";
};
