import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { MOCK_INVOICE_AUTO_ISSUANCE } from "@/lib/mock-data";
import type { InvoiceAutoIssuance } from "@/types/invoice";

const autoIssuancesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  sortBy: z
    .enum(["scheduleName", "targetClient", "nextIssuanceDate", "createdAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

type AutoIssuancesResponse = {
  data: InvoiceAutoIssuance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function filterAutoIssuances(
  autoIssuances: InvoiceAutoIssuance[],
  filters: z.infer<typeof autoIssuancesQuerySchema>,
): InvoiceAutoIssuance[] {
  let filtered = [...autoIssuances];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (ai) =>
        ai.scheduleName.toLowerCase().includes(searchLower) ||
        ai.targetClient.toLowerCase().includes(searchLower),
    );
  }

  filtered.sort((a, b) => {
    let aValue: string | number | undefined;
    let bValue: string | number | undefined;

    switch (filters.sortBy) {
      case "scheduleName":
        aValue = a.scheduleName;
        bValue = b.scheduleName;
        break;
      case "targetClient":
        aValue = a.targetClient;
        bValue = b.targetClient;
        break;
      case "nextIssuanceDate":
        aValue = a.nextIssuanceDate
          ? new Date(a.nextIssuanceDate).getTime()
          : 0;
        bValue = b.nextIssuanceDate
          ? new Date(b.nextIssuanceDate).getTime()
          : 0;
        break;
      case "createdAt":
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        break;
      default:
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    }

    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return filters.sortOrder === "asc" ? comparison : -comparison;
  });

  return filtered;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = autoIssuancesQuerySchema.safeParse(queryParams);

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

    const { page, limit, ...filters } = validatedQuery.data;

    const filteredAutoIssuances = filterAutoIssuances(
      MOCK_INVOICE_AUTO_ISSUANCE,
      validatedQuery.data,
    );

    const total = filteredAutoIssuances.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedAutoIssuances = filteredAutoIssuances.slice(
      startIndex,
      endIndex,
    );

    const response: AutoIssuancesResponse = {
      data: paginatedAutoIssuances,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.scheduleName || !body.merchantId || !body.targetClient) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "INVALID_REQUEST_BODY",
          message:
            "Missing required fields: scheduleName, merchantId, or targetClient",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const newAutoIssuance: InvoiceAutoIssuance = {
      ...body,
      id: `auto_${Date.now()}`,
      createdAt: new Date().toISOString(),
      enabled: body.enabled !== undefined ? body.enabled : true,
    };

    return NextResponse.json({ data: newAutoIssuance }, { status: 201 });
  } catch (error) {
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
