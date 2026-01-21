"use client";

import { AbilityProvider as BaseAbilityProvider } from "@/context/ability-context";
import { useSession } from "next-auth/react";
import type { AppUser } from "@/types/user";

/**
 * Client component wrapper for AbilityProvider that gets user from session
 */
export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user as AppUser | null;

  return <BaseAbilityProvider user={user}>{children}</BaseAbilityProvider>;
}
