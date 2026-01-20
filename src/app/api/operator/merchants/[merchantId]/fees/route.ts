import { NextRequest, NextResponse } from "next/server";
import { MOCK_MERCHANTS } from "@/lib/mock-data";
import { uuid } from "@/lib/utils";
import type {
  AppMerchantFee,
  MerchantFeeStatus,
  PaymentMethodType,
} from "@/types/merchant-fee";

type FeesResponse = {
  data: AppMerchantFee[];
};

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function buildFeesForMerchant(merchantId: string): AppMerchantFee[] {
  const brands = ["VISA", "MASTERCARD", "JCB"];
  const methods: PaymentMethodType[] = ["card", "bank"];

  const merchant = MOCK_MERCHANTS.find((m) => m.id === merchantId);
  if (!merchant) return [];

  const merchantIndex = MOCK_MERCHANTS.findIndex((m) => m.id === merchantId);
  const createdAt = new Date(
    Date.now() - merchantIndex * 24 * 60 * 60 * 1000,
  ).toISOString();
  const updatedAt = new Date(
    Date.now() - merchantIndex * 6 * 60 * 60 * 1000,
  ).toISOString();
  const status: MerchantFeeStatus =
    merchantIndex % 4 === 0 ? "suspended" : "active";

  const brand = brands[merchantIndex % brands.length];
  const paymentMethodType = methods[merchantIndex % methods.length];
  const mdrPercent = paymentMethodType === "card" ? 3.2 : 1.1;
  const fixedFee = paymentMethodType === "card" ? 0.3 : 1.5;

  return [
    {
      id: uuid("fee"),
      merchantId,
      brand,
      paymentMethodType,
      mdrPercent,
      fixedFee,
      createdAt,
      updatedAt,
      status,
    },
  ];
}

/**
 * GET /api/operator/merchants/[merchantId]/fees
 *
 * Fetch fees for a specific merchant
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

    const fees = buildFeesForMerchant(merchantId);

    const response: FeesResponse = {
      data: fees,
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
