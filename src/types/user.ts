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
};
