import { createAbility } from "@/lib/ability";
import type { Actions, Subjects } from "@/lib/ability";
import type { AppUser } from "@/types/user";

/**
 * Server-side permission check utility
 * Use this in Server Components and API routes
 */
export function checkPermission(
  user: AppUser | null,
  action: Actions,
  subject: Subjects,
): boolean {
  const ability = createAbility(user);
  return ability.can(action, subject);
}

/**
 * Server-side permission check with throw on failure
 * Use this when you want to throw an error if permission is denied
 */
export function requirePermission(
  user: AppUser | null,
  action: Actions,
  subject: Subjects,
): void {
  const ability = createAbility(user);
  if (!ability.can(action, subject)) {
    throw new Error(`Permission denied: Cannot ${action} ${subject}`);
  }
}
