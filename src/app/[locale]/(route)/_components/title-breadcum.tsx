"use client";

import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { useMemo } from "react";

export function TitleBreadcrumb() {
  const pathname = usePathname();
  const params = useParams();

  // Determine the base path (operator or merchant) from pathname
  const basePath = useMemo(() => {
    const segments = pathname
      .replace(/^\/[a-z]{2}\//, "")
      .split("/")
      .filter(Boolean);
    return segments[0] || "operator";
  }, [pathname]);

  // Use the appropriate translation namespace based on the base path
  const tOperator = useTranslations("Operator.Sidebar");
  const tMerchant = useTranslations("Merchant.Sidebar");
  const t = basePath === "operator" ? tOperator : tMerchant;

  const breadcrumbItems = useMemo(() => {
    // Remove locale prefix and split path
    const pathSegments = pathname
      .replace(/^\/[a-z]{2}\//, "") // Remove locale like /en/ or /ja/
      .split("/")
      .filter(Boolean);

    // If we're at the root path, don't show breadcrumbs
    if (pathSegments.length <= 1) {
      return [];
    }

    const items: Array<{ label: string; href?: string; active?: boolean }> = [];
    let currentPath = "";

    const paramValues = Object.values(params).flat();

    pathSegments.forEach((segment, index) => {
      // Skip the base segment (operator/merchant)
      if (segment === basePath) {
        return;
      }

      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Check if segment is a dynamic parameter ID
      if (paramValues.includes(segment)) {
        items.push({
          label: segment,
          href: isLast ? undefined : `/${basePath}${currentPath}`,
          active: isLast,
        });
        return;
      }

      // Convert segment to translation key
      let translationKey = segment;

      // Handle special cases
      if (segment === "merchant-management") {
        translationKey = "merchantsManagement";
      } else if (segment.includes("-")) {
        // Convert kebab-case to camelCase for translation keys
        translationKey = segment.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase(),
        );
      }

      // Try to get translation, fallback to formatted segment
      let label;
      try {
        label = t(translationKey);
      } catch {
        // If translation doesn't exist, format the segment nicely
        label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      // For merchant-management sub-routes, use nested translation
      if (
        pathSegments.includes("merchant-management") &&
        index > pathSegments.indexOf("merchant-management")
      ) {
        try {
          label = t(`merchantManagement.${translationKey}`);
        } catch {
          // Keep the fallback label
        }
      }

      items.push({
        label,
        href: isLast ? undefined : `/${basePath}${currentPath}`,
        active: isLast,
      });
    });

    return items;
  }, [pathname, basePath, t, params]);

  // Don't render if no breadcrumb items
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return <PageBreadcrumb items={breadcrumbItems} />;
}
