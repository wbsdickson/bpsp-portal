import { NextRequest, NextResponse } from "next/server";
import { MOCK_INVOICES } from "@/lib/mock-data";
import type { Invoice } from "@/types/invoice";

type InvoiceResponse = {
  data: Invoice;
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
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const { invoiceId } = await params;

    if (!invoiceId) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MISSING_INVOICE_ID",
          message: "Invoice ID is required",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const invoice = MOCK_INVOICES.find((inv) => inv.id === invoiceId);

    if (!invoice) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "INVOICE_NOT_FOUND",
          message: "Invoice not found",
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    if (invoice.deletedAt) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "INVOICE_DELETED",
          message: "Invoice has been deleted",
        },
      };
      return NextResponse.json(errorResponse, { status: 410 });
    }

    const response: InvoiceResponse = {
      data: invoice,
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
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const { invoiceId } = await params;
    const body = await request.json();

    if (!invoiceId) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MISSING_INVOICE_ID",
          message: "Invoice ID is required",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const invoice = MOCK_INVOICES.find((inv) => inv.id === invoiceId);

    if (!invoice) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "INVOICE_NOT_FOUND",
          message: "Invoice not found",
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    if (invoice.deletedAt) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "INVOICE_DELETED",
          message: "Cannot update a deleted invoice",
        },
      };
      return NextResponse.json(errorResponse, { status: 410 });
    }

    const updatedInvoice: Invoice = {
      ...invoice,
      ...body,
      id: invoiceId,
      updatedAt: new Date().toISOString(),
    };

    const response: InvoiceResponse = {
      data: updatedInvoice,
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
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const { invoiceId } = await params;

    if (!invoiceId) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "MISSING_INVOICE_ID",
          message: "Invoice ID is required",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const invoice = MOCK_INVOICES.find((inv) => inv.id === invoiceId);

    if (!invoice) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "INVOICE_NOT_FOUND",
          message: "Invoice not found",
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    if (invoice.deletedAt) {
      const errorResponse: ErrorResponse = {
        error: {
          code: "INVOICE_ALREADY_DELETED",
          message: "Invoice has already been deleted",
        },
      };
      return NextResponse.json(errorResponse, { status: 410 });
    }

    invoice.deletedAt = new Date().toISOString();

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
