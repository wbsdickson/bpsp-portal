import { useMemo } from "react";
import { usePathname } from "next/navigation";

export const useBasePath = () => {
  const pathname = usePathname();
  const basePath = useMemo(() => {
    const path = pathname.replace(/\/+$/, "");
    if (path.endsWith("/create")) {
      return path.slice(0, -"/create".length);
    }

    const editMatch = path.match(/^(.*)\/edit\/[^/]+$/);
    if (editMatch?.[1]) {
      return editMatch[1];
    }

    const parts = path.split("/").filter(Boolean);
    const last = parts.at(-1) ?? "";
    if (last && /\d/.test(last)) {
      return `/${parts.slice(0, -1).join("/")}`;
    }

    return path;
  }, [pathname]);

  return { basePath };
};
