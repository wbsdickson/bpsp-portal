"use client";

import * as React from "react";
import { Palette, Layout } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUserPreferencesStore } from "@/store/user-preferences-store";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

type SidebarVariant = "sidebar" | "floating" | "inset";

const SIDEBAR_VARIANTS: { value: SidebarVariant; label: string }[] = [
  { value: "sidebar", label: "Sidebar" },
  { value: "floating", label: "Floating" },
  { value: "inset", label: "Inset" },
];

const PRESET_COLORS = [
  { name: "Default", value: "" },
  { name: "Blue", value: "oklch(0.51 0.23 277)" },
  { name: "Purple", value: "oklch(0.51 0.23 300)" },
  { name: "Green", value: "oklch(0.4 0.15 150)" },
  { name: "Red", value: "oklch(0.577 0.245 27.325)" },
  { name: "Orange", value: "oklch(0.73 0.1864 52.57)" },
  { name: "Teal", value: "oklch(0.4 0.12 190)" },
];

export function UserPreferencesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const isMerchant = pathname?.includes("/merchant/");
  const t = useTranslations(
    isMerchant ? "Merchant.UserPreferences" : "Operator.UserPreferences",
  );
  const { preferences, setSidebarVariant, setPrimaryColor } =
    useUserPreferencesStore();
  const [customColor, setCustomColor] = React.useState(
    preferences.primaryColor,
  );

  React.useEffect(() => {
    if (open) {
      setCustomColor(preferences.primaryColor);
    }
  }, [open, preferences.primaryColor]);

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    setPrimaryColor(color);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Sidebar Variant */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layout className="size-4" />
              <Label htmlFor="sidebar-variant">{t("sidebarVariant")}</Label>
            </div>
            <Select
              value={preferences.sidebarVariant}
              onValueChange={(value) =>
                setSidebarVariant(value as SidebarVariant)
              }
            >
              <SelectTrigger id="sidebar-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SIDEBAR_VARIANTS.map((variant) => (
                  <SelectItem key={variant.value} value={variant.value}>
                    {variant.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="size-4" />
              <Label htmlFor="primary-color">{t("primaryColor")}</Label>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COLORS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant={
                      customColor === preset.value ? "default" : "outline"
                    }
                    className="h-10 w-full"
                    onClick={() => handleColorChange(preset.value)}
                    style={
                      preset.value
                        ? {
                            backgroundColor: preset.value,
                            borderColor: preset.value,
                          }
                        : undefined
                    }
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="text"
                  placeholder="oklch(0.51 0.23 277)"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="color"
                  value={
                    customColor && customColor.startsWith("oklch")
                      ? "#6366f1"
                      : customColor || "#6366f1"
                  }
                  onChange={(e) => {
                    // Convert hex to oklch (simplified - you might want a proper converter)
                    const hex = e.target.value;
                    // For now, just store hex if not oklch format
                    handleColorChange(hex);
                  }}
                  className="h-10 w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
