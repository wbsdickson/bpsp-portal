import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_USERS } from "@/lib/mock-data";
import type { User } from "@/lib/types";

type MembersResponse = {
  data: User[];
};

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

/**
 * GET /api/operator/merchants/[merchantId]/members
 *
 * Fetch members for a specific merchant
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

    // Filter members by merchantId and exclude deleted members
    const members = MOCK_USERS.filter(
      (user) => user.merchantId === merchantId && !user.deletedAt,
    );

    const response: MembersResponse = {
      data: members,
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
