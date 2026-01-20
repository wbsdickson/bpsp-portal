import { NextRequest, NextResponse } from "next/server";
import { MOCK_MERCHANTS } from "@/lib/mock-data";
import type { Merchant } from "@/lib/types";
import type { AppMerchant, MerchantStatus } from "@/types/merchant";

type MerchantResponse = {
  data: AppMerchant;
};

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
function transformToAppMerchant(merchant: Merchant): AppMerchant {
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
 * GET /api/operator/merchants/[merchantId]
 *
 * Fetch a single merchant by ID
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

    const merchant = MOCK_MERCHANTS.find((m) => m.id === merchantId);

    if (!merchant) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MERCHANT_NOT_FOUND",
          message: "Merchant not found",
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const appMerchant = transformToAppMerchant(merchant);

    const response: MerchantResponse = {
      data: appMerchant,
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

/**
 * PATCH /api/operator/merchants/[merchantId]
 *
 * Update a merchant
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ merchantId: string }> },
) {
  try {
    const { merchantId } = await params;
    const body = await request.json();

    if (!merchantId) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MISSING_MERCHANT_ID",
          message: "Merchant ID is required",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const merchant = MOCK_MERCHANTS.find((m) => m.id === merchantId);

    if (!merchant) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MERCHANT_NOT_FOUND",
          message: "Merchant not found",
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Update merchant with provided data
    const updatedMerchant = {
      ...merchant,
      ...body,
    };

    const appMerchant = transformToAppMerchant(updatedMerchant);

    const response: MerchantResponse = {
      data: appMerchant,
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
