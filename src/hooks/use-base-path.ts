import { useMemo } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook to extract the base path from the current route pathname.
 *
 * This hook is useful for generating navigation paths relative to the current route,
 * especially when working with dynamic routes, detail pages, and nested routes.
 *
 * @returns {Object} An object containing the `basePath` string
 *
 * @example
 * // Example 1: List page
 * // Current path: "/en/merchant/quotations"
 * // Returns: { basePath: "/en/merchant/quotations" }
 * const { basePath } = useBasePath();
 * router.push(`${basePath}/create`); // "/en/merchant/quotations/create"
 *
 * @example
 * // Example 2: Create page
 * // Current path: "/en/merchant/quotations/create"
 * // Returns: { basePath: "/en/merchant/quotations" }
 * const { basePath } = useBasePath();
 * router.push(basePath); // "/en/merchant/quotations"
 *
 * @example
 * // Example 3: Edit page
 * // Current path: "/en/merchant/quotations/edit/q_123"
 * // Returns: { basePath: "/en/merchant/quotations" }
 * const { basePath } = useBasePath();
 * router.push(`${basePath}/q_123`); // "/en/merchant/quotations/q_123"
 *
 * @example
 * // Example 4: Detail page with numeric ID
 * // Current path: "/en/merchant/quotations/q_123"
 * // Returns: { basePath: "/en/merchant/quotations" }
 * const { basePath } = useBasePath();
 * router.push(`${basePath}/edit/q_123`); // "/en/merchant/quotations/edit/q_123"
 *
 * @example
 * // Example 5: Detail page with non-numeric ID
 * // Current path: "/en/merchant/receipt/rc_002"
 * // Returns: { basePath: "/en/merchant/receipt/rc_002" }
 * // (Non-numeric IDs are preserved)
 * const { basePath } = useBasePath();
 *
 * @example
 * // Example 6: Path with trailing slash
 * // Current path: "/en/merchant/quotations/"
 * // Returns: { basePath: "/en/merchant/quotations" }
 * const { basePath } = useBasePath();
 */
export const useBasePath = () => {
  const pathname = usePathname();
  const basePath = useMemo(() => {
    // Remove trailing slashes
    const path = pathname.replace(/\/+$/, "");

    // Handle /create routes: remove "/create" suffix
    // Example: "/en/merchant/quotations/create" -> "/en/merchant/quotations"
    if (path.endsWith("/create")) {
      return path.slice(0, -"/create".length);
    }

    // Handle /edit/[id] routes: extract base path before "/edit/[id]"
    // Example: "/en/merchant/quotations/edit/q_123" -> "/en/merchant/quotations"
    const editMatch = path.match(/^(.*)\/edit\/[^/]+$/);
    if (editMatch?.[1]) {
      return editMatch[1];
    }

    // Check if the last segment contains digits (likely an ID)
    // Example: "/en/merchant/quotations/q_123" -> "/en/merchant/quotations"
    const parts = path.split("/").filter(Boolean);
    const last = parts.at(-1) ?? "";
    if (last && /\d/.test(last)) {
      return `/${parts.slice(0, -1).join("/")}`;
    }

    // Return path as-is if no special handling needed
    return path;
  }, [pathname]);

  return { basePath };
};
