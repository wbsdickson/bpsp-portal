import type { LucideIcon } from "lucide-react";

export type RouteSidebar = {
  label: string;
  route: string;
  icon?: LucideIcon;
  isActive?: boolean;
  children?: RouteSidebar[];
};
