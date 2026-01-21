"use client";

import { useAbility } from "@/context/ability-context";
import type { Actions, Subjects } from "@/lib/ability";

type CanProps = {
  I: Actions;
  a: Subjects;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Component to conditionally render content based on user permissions
 * Usage: <Can I="create" a="Invoice">...</Can>
 */
export function Can({ I, a, children, fallback = null }: CanProps) {
  const ability = useAbility();

  if (ability.can(I, a)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
