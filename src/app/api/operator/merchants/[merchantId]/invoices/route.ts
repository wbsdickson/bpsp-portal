import { NextRequest, NextResponse } from "next/server";
import { MOCK_INVOICES } from "@/lib/mock-data";
import type { Invoice } from "@/types/invoice";

type InvoicesResponse = {
  data: Invoice[];
};

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

/**
 * GET /api/operator/merchants/[merchantId]/invoices
 *
 * Fetch invoices for a specific merchant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ merchantId: string }> },
) {
  try {
    const { merchantId } = await params;

    if (!merchantId) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MISSING_MERCHANT_ID",
          message: "Merchant ID is required",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Filter invoices by merchantId and exclude deleted invoices
    const invoices = MOCK_INVOICES.filter(
      (invoice) => invoice.merchantId === merchantId && !invoice.deletedAt,
    );

    const response: InvoicesResponse = {
      data: invoices,
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
