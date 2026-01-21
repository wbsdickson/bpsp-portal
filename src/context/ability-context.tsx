"use client";

import { createContext, useContext, useMemo } from "react";
import type { AppAbility, Actions, Subjects } from "@/lib/ability";
import { createAbility } from "@/lib/ability";
import type { AppUser } from "@/types/user";

// Create ability context
const AbilityContext = createContext<AppAbility | undefined>(undefined);

/**
 * Provider component that wraps the application with CASL ability context
 */
export function AbilityProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AppUser | null;
}) {
  const ability = useMemo(() => createAbility(user), [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

/**
 * Hook to access the current ability instance
 */
export function useAbility(): AppAbility {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error("useAbility must be used within AbilityProvider");
  }
  return context;
}

/**
 * Hook to check if user can perform an action on a subject
 * Usage: const { can } = useCan(); if (can("create", "Invoice")) { ... }
 */
export function useCan() {
  const ability = useAbility();

  return {
    can: (action: Actions, subject: Subjects) => ability.can(action, subject),
    cannot: (action: Actions, subject: Subjects) =>
      ability.cannot(action, subject),
  };
}
