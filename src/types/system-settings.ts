export type SystemSettings = {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  senderEmailAddress: string;

  enableEmailNotifications: boolean;
  enableInAppNotifications: boolean;

  defaultInvoiceDueDays: number;
  maxLoginAttempts: number;
  sessionTimeoutMinutes: number;

  updatedAt: string;
};
