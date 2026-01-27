import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { MOCK_INVOICES } from "@/lib/mock-data";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

const invoicesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  status: z.string().optional(),
  search: z.string().optional(),
  invoiceDateFrom: z.string().optional(),
  invoiceDateTo: z.string().optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
  sortBy: z
    .enum(["invoiceNumber", "invoiceDate", "dueDate", "amount"])
    .optional()
    .default("invoiceDate"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

type InvoicesResponse = {
  data: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    filters?: {
      status?: InvoiceStatus | InvoiceStatus[];
      search?: string;
      invoiceDateFrom?: string;
      invoiceDateTo?: string;
      dueDateFrom?: string;
      dueDateTo?: string;
    };
  };
};

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function isDateInRange(
  dateStr: string | undefined,
  fromStr?: string,
  toStr?: string,
): boolean {
  if (!dateStr) return !fromStr && !toStr;

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;

  if (fromStr) {
    const from = new Date(fromStr);
    if (!Number.isNaN(from.getTime()) && date < from) return false;
  }

  if (toStr) {
    const to = new Date(toStr);
    to.setHours(23, 59, 59, 999);
    if (!Number.isNaN(to.getTime()) && date > to) return false;
  }

  return true;
}

function filterInvoices(
  invoices: Invoice[],
  filters: z.infer<typeof invoicesQuerySchema>,
): Invoice[] {
  let filtered = [...invoices];

  filtered = filtered.filter((inv) => !inv.deletedAt);

  if (filters.status) {
    const statusValues = filters.status.split(",") as InvoiceStatus[];
    filtered = filtered.filter((inv) => statusValues.includes(inv.status));
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(searchLower) ||
        inv.recipientName?.toLowerCase().includes(searchLower) ||
        inv.notes?.toLowerCase().includes(searchLower) ||
        inv.subject?.toLowerCase().includes(searchLower),
    );
  }

  if (filters.invoiceDateFrom || filters.invoiceDateTo) {
    filtered = filtered.filter((inv) =>
      isDateInRange(
        inv.invoiceDate,
        filters.invoiceDateFrom,
        filters.invoiceDateTo,
      ),
    );
  }

  if (filters.dueDateFrom || filters.dueDateTo) {
    filtered = filtered.filter((inv) =>
      isDateInRange(inv.dueDate, filters.dueDateFrom, filters.dueDateTo),
    );
  }

  filtered.sort((a, b) => {
    let aValue: string | number | undefined;
    let bValue: string | number | undefined;

    switch (filters.sortBy) {
      case "invoiceNumber":
        aValue = a.invoiceNumber;
        bValue = b.invoiceNumber;
        break;
      case "invoiceDate":
        aValue = a.invoiceDate ? new Date(a.invoiceDate).getTime() : 0;
        bValue = b.invoiceDate ? new Date(b.invoiceDate).getTime() : 0;
        break;
      case "dueDate":
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case "amount":
        aValue = a.amount ?? 0;
        bValue = b.amount ?? 0;
        break;
      default:
        aValue = a.invoiceDate ? new Date(a.invoiceDate).getTime() : 0;
        bValue = b.invoiceDate ? new Date(b.invoiceDate).getTime() : 0;
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

    const validatedQuery = invoicesQuerySchema.safeParse(queryParams);

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

    const filteredInvoices = filterInvoices(MOCK_INVOICES, validatedQuery.data);

    const total = filteredInvoices.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

    const response: InvoicesResponse = {
      data: paginatedInvoices,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      meta: {
        filters: {
          ...(filters.status && {
            status: filters.status.split(",") as InvoiceStatus[],
          }),
          ...(filters.search && { search: filters.search }),
          ...(filters.invoiceDateFrom && {
            invoiceDateFrom: filters.invoiceDateFrom,
          }),
          ...(filters.invoiceDateTo && {
            invoiceDateTo: filters.invoiceDateTo,
          }),
          ...(filters.dueDateFrom && { dueDateFrom: filters.dueDateFrom }),
          ...(filters.dueDateTo && { dueDateTo: filters.dueDateTo }),
        },
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

    if (!body.invoiceNumber || !body.merchantId || !body.clientId) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "INVALID_REQUEST_BODY",
          message:
            "Missing required fields: invoiceNumber, merchantId, or clientId",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const newInvoice: Invoice = {
      ...body,
      id: `inv-${Date.now()}`, // Generate ID
      createdAt: new Date().toISOString(),
      status: body.status || "draft",
    };

    return NextResponse.json({ data: newInvoice }, { status: 201 });
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
