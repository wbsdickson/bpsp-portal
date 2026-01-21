import { AbilityBuilder, PureAbility } from "@casl/ability";
import type { UserRole } from "@/lib/types";
import type { AppUser } from "@/types/user";
import abilityConfig from "./ability-config.json";

// Define subjects (resources) that can be accessed
export type Subjects =
  | "User"
  | "Merchant"
  | "Invoice"
  | "Client"
  | "Transaction"
  | "Payment"
  | "Dashboard"
  | "Settings"
  | "Report"
  | "Account"
  | "all";

// Define actions that can be performed
export type Actions =
  | "manage" // All actions
  | "create"
  | "read"
  | "update"
  | "delete"
  | "view"
  | "edit"
  | "approve"
  | "reject"
  | "export";

export type AppAbility = PureAbility<[Actions, Subjects]>;

type PermissionConfig = {
  action: Actions;
  subject: Subjects;
  conditions?: Record<string, unknown>;
};

type RoleConfig = {
  permissions?: PermissionConfig[];
  restrictions?: PermissionConfig[];
};

type AbilityConfig = {
  roles: Record<UserRole, RoleConfig>;
};

/**
 * Define abilities based on user role using static JSON configuration
 */
export function defineAbilityFor(user: AppUser | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

  if (!user) {
    // No user = no permissions
    return build();
  }

  const userRole = user.role as UserRole;
  const config = (abilityConfig as AbilityConfig).roles[userRole];

  if (!config) {
    // Unknown role = no permissions
    return build();
  }

  // Apply permissions from JSON config
  if (config.permissions) {
    for (const permission of config.permissions) {
      // Resolve conditions dynamically based on user context
      const conditions = permission.conditions
        ? resolveConditions(permission.conditions, user)
        : undefined;

      if (conditions) {
        can(permission.action, permission.subject, conditions);
      } else {
        can(permission.action, permission.subject);
      }
    }
  }

  // Apply restrictions from JSON config
  if (config.restrictions) {
    for (const restriction of config.restrictions) {
      const conditions = restriction.conditions
        ? resolveConditions(restriction.conditions, user)
        : undefined;

      if (conditions) {
        cannot(restriction.action, restriction.subject, conditions);
      } else {
        cannot(restriction.action, restriction.subject);
      }
    }
  }

  return build();
}

/**
 * Resolve condition placeholders with actual user values
 */
function resolveConditions(
  conditions: Record<string, unknown>,
  user: AppUser,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(conditions)) {
    if (typeof value === "string" && value.startsWith("$user.")) {
      // Resolve user property references like "$user.merchantId"
      const prop = value.replace("$user.", "") as keyof AppUser;
      resolved[key] = user[prop];
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Create ability instance for a user
 */
export function createAbility(user: AppUser | null): AppAbility {
  return defineAbilityFor(user);
}
