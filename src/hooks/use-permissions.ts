"use client";

import { useAbility } from "@/context/ability-context";
import type { Actions, Subjects } from "@/lib/ability";

/**
 * Hook for permission checks in components
 * Usage: const { canCreateInvoice, canDeleteInvoice } = usePermissions();
 */
export function usePermissions() {
  const ability = useAbility();

  return {
    // Invoice permissions
    canCreateInvoice: () => ability.can("create", "Invoice"),
    canReadInvoice: () => ability.can("read", "Invoice"),
    canUpdateInvoice: () => ability.can("update", "Invoice"),
    canDeleteInvoice: () => ability.can("delete", "Invoice"),
    canApproveInvoice: () => ability.can("approve", "Invoice"),
    canRejectInvoice: () => ability.can("reject", "Invoice"),
    canExportInvoice: () => ability.can("export", "Invoice"),

    // Client permissions
    canCreateClient: () => ability.can("create", "Client"),
    canReadClient: () => ability.can("read", "Client"),
    canUpdateClient: () => ability.can("update", "Client"),
    canDeleteClient: () => ability.can("delete", "Client"),

    // Merchant permissions
    canManageMerchant: () => ability.can("manage", "Merchant"),
    canReadMerchant: () => ability.can("read", "Merchant"),

    // User permissions
    canManageUser: () => ability.can("manage", "User"),
    canReadUser: () => ability.can("read", "User"),

    // Settings permissions
    canManageSettings: () => ability.can("manage", "Settings"),
    canReadSettings: () => ability.can("read", "Settings"),

    // Report permissions
    canReadReport: () => ability.can("read", "Report"),
    canExportReport: () => ability.can("export", "Report"),

    // Dashboard permissions
    canReadDashboard: () => ability.can("read", "Dashboard"),

    // Generic permission check
    can: (action: Actions, subject: Subjects) => ability.can(action, subject),
    cannot: (action: Actions, subject: Subjects) => ability.cannot(action, subject),
  };
}
