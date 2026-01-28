import { NextRequest, NextResponse } from "next/server";
import { MOCK_INVOICE_AUTO_ISSUANCE } from "@/lib/mock-data";
import type { InvoiceAutoIssuance } from "@/types/invoice";

type AutoIssuanceResponse = {
  data: InvoiceAutoIssuance;
};

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ autoIssuanceId: string }> },
) {
  try {
    const { autoIssuanceId } = await params;

    if (!autoIssuanceId) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MISSING_AUTO_ISSUANCE_ID",
          message: "Auto issuance ID is required",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const autoIssuanceIndex = MOCK_INVOICE_AUTO_ISSUANCE.findIndex(
      (ai) => ai.id === autoIssuanceId,
    );

    const autoIssuance =
      autoIssuanceIndex >= 0
        ? MOCK_INVOICE_AUTO_ISSUANCE[autoIssuanceIndex]
        : undefined;

    if (!autoIssuance) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "AUTO_ISSUANCE_NOT_FOUND",
          message: "Auto issuance not found",
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const response: AutoIssuanceResponse = {
      data: autoIssuance,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ autoIssuanceId: string }> },
) {
  try {
    const { autoIssuanceId } = await params;
    const body = await request.json();

    if (!autoIssuanceId) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MISSING_AUTO_ISSUANCE_ID",
          message: "Auto issuance ID is required",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const autoIssuance = MOCK_INVOICE_AUTO_ISSUANCE.find(
      (ai) => ai.id === autoIssuanceId,
    );

    if (!autoIssuance) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "AUTO_ISSUANCE_NOT_FOUND",
          message: "Auto issuance not found",
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const updatedAutoIssuance: InvoiceAutoIssuance = {
      ...autoIssuance,
      ...body,
      id: autoIssuanceId,
      updatedAt: new Date().toISOString(),
    };

    MOCK_INVOICE_AUTO_ISSUANCE[autoIssuanceId as unknown as number] =
      updatedAutoIssuance;

    const response: AutoIssuanceResponse = {
      data: updatedAutoIssuance,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ autoIssuanceId: string }> },
) {
  try {
    const { autoIssuanceId } = await params;

    if (!autoIssuanceId) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MISSING_AUTO_ISSUANCE_ID",
          message: "Auto issuance ID is required",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const autoIssuanceIndex = MOCK_INVOICE_AUTO_ISSUANCE.findIndex(
      (ai) => ai.id === autoIssuanceId,
    );

    const autoIssuance =
      autoIssuanceIndex >= 0
        ? MOCK_INVOICE_AUTO_ISSUANCE[autoIssuanceIndex]
        : undefined;

    if (!autoIssuance) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "AUTO_ISSUANCE_NOT_FOUND",
          message: "Auto issuance not found",
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    MOCK_INVOICE_AUTO_ISSUANCE.splice(autoIssuanceIndex, 1);

    return NextResponse.json({ success: true }, { status: 200 });
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
