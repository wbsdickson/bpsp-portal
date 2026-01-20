import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { MOCK_MERCHANTS } from "@/lib/mock-data";
import type { Merchant } from "@/lib/types";
import type { AppMerchant, MerchantStatus } from "@/types/merchant";

// Query parameters schema for filtering and pagination
const merchantsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  status: z.enum(["active", "suspended"]).optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["name", "createdAt", "transactionCount"])
    .optional()
    .default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Response type
type MerchantsResponse = {
  data: AppMerchant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    filters?: {
      status?: MerchantStatus;
      search?: string;
    };
  };
};

// Error response type
type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

/**
 * Transform Merchant to AppMerchant with additional fields
 */
function transformToAppMerchant(
  merchant: Merchant,
  index: number,
): AppMerchant {
  // Generate mock transaction count (for demo purposes)
  const transactionCount = Math.floor(Math.random() * 1000);

  // Generate mock creation date (for demo purposes)
  const daysAgo = Math.floor(Math.random() * 365);
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);

  // Random status for demo (80% active, 20% suspended)
  const status: MerchantStatus = Math.random() > 0.2 ? "active" : "suspended";

  return {
    ...merchant,
    createdAt: createdAt.toISOString(),
    status,
    transactionCount,
  };
}

/**
 * Filter merchants based on query parameters
 */
function filterMerchants(
  merchants: AppMerchant[],
  filters: z.infer<typeof merchantsQuerySchema>,
): AppMerchant[] {
  let filtered = [...merchants];

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((m) => m.status === filters.status);
  }

  // Filter by search term (name, email, or address)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(searchLower) ||
        m.invoiceEmail.toLowerCase().includes(searchLower) ||
        m.address?.toLowerCase().includes(searchLower),
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let aValue: string | number | undefined;
    let bValue: string | number | undefined;

    switch (filters.sortBy) {
      case "name":
        aValue = a.name;
        bValue = b.name;
        break;
      case "createdAt":
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        break;
      case "transactionCount":
        aValue = a.transactionCount ?? 0;
        bValue = b.transactionCount ?? 0;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return filters.sortOrder === "asc" ? comparison : -comparison;
  });

  return filtered;
}

/**
 * GET /api/operator/merchants
 *
 * Fetch merchants with filtering, pagination, and sorting
 *
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * - status: Filter by status ("active" | "suspended")
 * - search: Search in name, email, or address
 * - sortBy: Sort field ("name" | "createdAt" | "transactionCount")
 * - sortOrder: Sort direction ("asc" | "desc")
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = merchantsQuerySchema.safeParse(queryParams);

    if (!validatedQuery.success) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "INVALID_QUERY_PARAMETERS",
          message: "Invalid query parameters",
          details: validatedQuery.error.issues,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const filters = validatedQuery.data;

    // Transform mock merchants to AppMerchant format
    const appMerchants = MOCK_MERCHANTS.map(transformToAppMerchant);

    // Apply filters and sorting
    const filteredMerchants = filterMerchants(appMerchants, filters);

    // Calculate pagination
    const total = filteredMerchants.length;
    const totalPages = Math.ceil(total / filters.limit);
    const startIndex = (filters.page - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex);

    // Build response
    const response: MerchantsResponse = {
      data: paginatedMerchants,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
      },
      meta: {
        filters: {
          ...(filters.status && { status: filters.status }),
          ...(filters.search && { search: filters.search }),
        },
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // Handle unexpected errors
    const errorResponse: ErrorResponse = {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.stack : error,
        }),
      },
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
