"use client";

import { useState, useMemo } from "react";
import * as CustomIcons from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AudioWaveform,
  ChevronsUpDown,
  User,
  Key,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Building2,
  Users,
  UserCircle,
  Wallet,
  CreditCard,
  ShoppingBag,
  Receipt,
  File,
  FileText,
  FileCheck,
  Zap,
  Quote,
  ShoppingCart,
  Truck,
  StickyNote,
  Store,
  TrendingUp,
  Moon,
  Sun,
  Laptop,
  ChevronLeft,
  ChevronRight,
  X,
  Search as SearchIcon,
  ScrollText,
  Plus,
  Pen,
  Check,
  Eye,
  EyeOff,
  MoreHorizontal,
  Palette,
  Layout,
  BookOpen,
  LifeBuoy,
  Minus,
  Trash2,
  Pencil,
  Calendar as CalendarIcon,
  TrendingDown,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Languages,
  GripVerticalIcon,
  ChevronDownIcon,
  ChevronDown,
  Home,
} from "lucide-react";

// Icon usage mapping - extracted from codebase
const lucideIconUsage: Record<
  string,
  { component: React.ComponentType<any>; usages: string[] }
> = {
  AudioWaveform: { component: AudioWaveform, usages: ["TeamSwitcher"] },
  ChevronsUpDown: { component: ChevronsUpDown, usages: ["TeamSwitcher"] },
  User: {
    component: User,
    usages: ["TeamSwitcher", "MerchantSidebar", "OperatorSidebar"],
  },
  Key: { component: Key, usages: ["TeamSwitcher"] },
  Bell: {
    component: Bell,
    usages: [
      "TeamSwitcher",
      "NotificationPopover",
      "MerchantSidebar",
      "OperatorSidebar",
    ],
  },
  Settings: { component: Settings, usages: ["TeamSwitcher", "HeaderButtons"] },
  HelpCircle: {
    component: HelpCircle,
    usages: ["TeamSwitcher", "HelpPopover"],
  },
  LogOut: { component: LogOut, usages: ["TeamSwitcher"] },
  LayoutDashboard: {
    component: LayoutDashboard,
    usages: ["MerchantSidebar", "OperatorSidebar"],
  },
  Building2: {
    component: Building2,
    usages: ["MerchantSidebar", "OperatorSidebar"],
  },
  Users: { component: Users, usages: ["MerchantSidebar", "OperatorSidebar"] },
  UserCircle: { component: UserCircle, usages: ["MerchantSidebar"] },
  Wallet: { component: Wallet, usages: ["MerchantSidebar", "OperatorSidebar"] },
  CreditCard: {
    component: CreditCard,
    usages: ["MerchantSidebar", "OperatorSidebar"],
  },
  ShoppingBag: { component: ShoppingBag, usages: ["MerchantSidebar"] },
  Receipt: {
    component: Receipt,
    usages: ["MerchantSidebar", "OperatorSidebar", "HeaderButtons"],
  },
  File: { component: File, usages: ["MerchantSidebar"] },
  FileText: {
    component: FileText,
    usages: ["MerchantSidebar", "HeaderButtons"],
  },
  FileCheck: { component: FileCheck, usages: ["MerchantSidebar"] },
  Zap: { component: Zap, usages: ["MerchantSidebar", "HelpPopover"] },
  Quote: { component: Quote, usages: ["MerchantSidebar"] },
  ShoppingCart: { component: ShoppingCart, usages: ["MerchantSidebar"] },
  Truck: { component: Truck, usages: ["MerchantSidebar"] },
  StickyNote: { component: StickyNote, usages: ["MerchantSidebar"] },
  Store: { component: Store, usages: ["OperatorSidebar", "HeaderButtons"] },
  TrendingUp: { component: TrendingUp, usages: ["OperatorSidebar"] },
  Moon: { component: Moon, usages: ["ThemeToggle"] },
  Sun: { component: Sun, usages: ["ThemeToggle"] },
  Laptop: { component: Laptop, usages: ["ThemeToggle"] },
  ChevronLeft: {
    component: ChevronLeft,
    usages: ["TabsHorizontal", "UserRegistrationForm"],
  },
  ChevronRight: {
    component: ChevronRight,
    usages: ["TabsHorizontal", "DeveloperPage"],
  },
  X: {
    component: X,
    usages: ["TabsHorizontal", "MultipleTables", "MultipleForms"],
  },
  Search: { component: SearchIcon, usages: ["Search", "FAQ", "Notifications"] },
  ScrollText: { component: ScrollText, usages: ["NotificationPopover"] },
  Plus: { component: Plus, usages: ["MultipleTables", "MultiplePages"] },
  Pen: { component: Pen, usages: ["MultipleDetailPages"] },
  Check: { component: Check, usages: ["MultipleDetailPages"] },
  Eye: { component: Eye, usages: ["UserForms"] },
  EyeOff: { component: EyeOff, usages: ["UserForms"] },
  MoreHorizontal: { component: MoreHorizontal, usages: ["ActionCell"] },
  Palette: { component: Palette, usages: ["UserPreferencesDialog"] },
  Layout: { component: Layout, usages: ["UserPreferencesDialog"] },
  BookOpen: { component: BookOpen, usages: ["HelpPopover"] },
  LifeBuoy: { component: LifeBuoy, usages: ["HelpPopover"] },
  Minus: { component: Minus, usages: ["MultipleForms"] },
  Trash2: { component: Trash2, usages: ["InvoiceCreate"] },
  Pencil: { component: Pencil, usages: ["InvoiceCreate"] },
  Calendar: { component: CalendarIcon, usages: ["MonthlySummary"] },
  TrendingDown: { component: TrendingDown, usages: ["MonthlySummary"] },
  DollarSign: {
    component: DollarSign,
    usages: ["MonthlySummary", "Dashboard"],
  },
  CheckCircle: { component: CheckCircle, usages: ["MonthlySummary"] },
  XCircle: { component: XCircle, usages: ["MonthlySummary"] },
  Clock: { component: Clock, usages: ["MonthlySummary"] },
  CheckCircle2: {
    component: CheckCircle2,
    usages: ["RegisterComplete", "ForgotPassword", "PasswordForm"],
  },
  ArrowLeft: { component: ArrowLeft, usages: ["ForgotPassword"] },
  Loader2: { component: Loader2, usages: ["EmailForm", "PasswordForm"] },
  Languages: { component: Languages, usages: ["LocaleSwitcherHorizontal"] },
  GripVerticalIcon: { component: GripVerticalIcon, usages: ["Resizable"] },
  ChevronDownIcon: { component: ChevronDownIcon, usages: ["Accordion"] },
  ChevronDown: { component: ChevronDown, usages: ["DeveloperPage"] },
  Home: { component: Home, usages: ["DeveloperPage"] },
};

function SectionWrapper({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <Separator />
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function IconsSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // Get all custom icons
  const customIconEntries = Object.entries(CustomIcons).filter(
    ([key]) => key !== "default",
  );

  // Get all lucide icons used in the project, sorted by name
  const allLucideIcons = Object.entries(lucideIconUsage).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  // Filter custom icons based on search query
  const filteredCustomIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return customIconEntries;
    }
    const query = searchQuery.toLowerCase();
    return customIconEntries.filter(([name]) =>
      name.toLowerCase().includes(query),
    );
  }, [customIconEntries, searchQuery]);

  // Filter lucide icons based on search query
  const filteredLucideIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return allLucideIcons;
    }
    const query = searchQuery.toLowerCase();
    return allLucideIcons.filter(
      ([iconName, { usages }]) =>
        iconName.toLowerCase().includes(query) ||
        usages.some((usage) => usage.toLowerCase().includes(query)),
    );
  }, [allLucideIcons, searchQuery]);

  return (
    <SectionWrapper
      title="Icons"
      description="Browse all custom icons and Lucide React icons used in the project."
    >
      {/* Search Input */}
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Search icons by name or usage..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-card"
        />
      </div>

      {/* Custom Icons Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Custom Icons</h3>
          <p className="text-muted-foreground text-sm">
            Icons defined in <code className="text-xs">/components/icons</code>
            {filteredCustomIcons.length !== customIconEntries.length && (
              <span className="ml-2">
                ({filteredCustomIcons.length} of {customIconEntries.length})
              </span>
            )}
          </p>
        </div>
        {filteredCustomIcons.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No custom icons found matching "{searchQuery}"
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {filteredCustomIcons.map(([name, IconComponent]) => (
              <Card key={name} className="flex flex-col items-center p-4">
                <div className="mb-2 flex h-16 w-16 items-center justify-center">
                  <IconComponent className="size-8" />
                </div>
                <p className="text-center text-xs font-medium">{name}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Lucide React Icons Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Lucide React Icons</h3>
          <p className="text-muted-foreground text-sm">
            Icons from <code className="text-xs">lucide-react</code> used in the
            project
            {filteredLucideIcons.length !== allLucideIcons.length && (
              <span className="ml-2">
                ({filteredLucideIcons.length} of {allLucideIcons.length})
              </span>
            )}
          </p>
        </div>
        {filteredLucideIcons.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No Lucide React icons found matching "{searchQuery}"
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLucideIcons.map(
              ([iconName, { component: IconComponent, usages }]) => (
                <Card key={iconName} className="p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
                      <IconComponent className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{iconName}</p>
                      {usages.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {usages.map((usage) => (
                            <Badge
                              key={usage}
                              variant="secondary"
                              className="text-xs"
                            >
                              {usage}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ),
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
