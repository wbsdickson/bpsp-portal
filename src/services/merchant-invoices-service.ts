import { Effect } from "effect";
import type { AxiosError } from "axios";
import { apiClient, fetchWithEffect } from "@/lib/api-client";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import {
  invoicesResponseSchema,
  invoiceResponseSchema,
} from "@/app/[locale]/(route)/merchant/invoice-management/_lib/invoice-schema";

export type InvoicesResponse = {
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

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type InvoicesApiParams = {
  page?: number;
  limit?: number;
  status?: InvoiceStatus | InvoiceStatus[];
  search?: string;
  invoiceDateFrom?: string;
  invoiceDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: "invoiceNumber" | "invoiceDate" | "dueDate" | "amount";
  sortOrder?: "asc" | "desc";
};

const fetchInvoicesEffect = (
  params: InvoicesApiParams,
): Effect.Effect<InvoicesResponse, AxiosError | Error> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) {
    if (Array.isArray(params.status)) {
      searchParams.set("status", params.status.join(","));
    } else {
      searchParams.set("status", params.status);
    }
  }
  if (params.search) searchParams.set("search", params.search);
  if (params.invoiceDateFrom)
    searchParams.set("invoiceDateFrom", params.invoiceDateFrom);
  if (params.invoiceDateTo)
    searchParams.set("invoiceDateTo", params.invoiceDateTo);
  if (params.dueDateFrom) searchParams.set("dueDateFrom", params.dueDateFrom);
  if (params.dueDateTo) searchParams.set("dueDateTo", params.dueDateTo);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryString = searchParams.toString();
  const url = `/api/merchant/invoices${queryString ? `?${queryString}` : ""}`;

  return fetchWithEffect<unknown>(() => apiClient.get<unknown>(url)).pipe(
    Effect.flatMap((data) =>
      Effect.try({
        try: () => invoicesResponseSchema.parse(data),
        catch: (error) =>
          new Error(`Schema validation failed: ${String(error)}`),
      }),
    ),
    Effect.map((validatedData) => validatedData as InvoicesResponse),
  );
};

export const getAllInvoices = async (
  params: InvoicesApiParams,
): Promise<InvoicesResponse> => {
  const program = fetchInvoicesEffect(params);
  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error ? error.message : "Failed to fetch invoices");

      return Effect.fail(new Error(errorMessage));
    }),
  );
};

const fetchInvoiceByIdEffect = (
  invoiceId: string,
): Effect.Effect<{ data: Invoice }, AxiosError | Error> => {
  const url = `/api/merchant/invoices/${invoiceId}`;

  return fetchWithEffect<unknown>(() => apiClient.get<unknown>(url)).pipe(
    Effect.flatMap((data) =>
      Effect.try({
        try: () => invoiceResponseSchema.parse(data),
        catch: (error) =>
          new Error(`Schema validation failed: ${String(error)}`),
      }),
    ),
    Effect.map((validatedData) => validatedData as { data: Invoice }),
  );
};

export const fetchInvoiceById = async (
  invoiceId: string,
): Promise<{ data: Invoice }> => {
  const program = fetchInvoiceByIdEffect(invoiceId);
  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error ? error.message : "Failed to fetch invoice");

      return Effect.fail(new Error(errorMessage));
    }),
  );
};

export const updateInvoice = async (
  invoiceId: string,
  data: Partial<Invoice>,
): Promise<{ data: Invoice }> => {
  const url = `/api/merchant/invoices/${invoiceId}`;

  const program = fetchWithEffect<{ data: Invoice }>(() =>
    apiClient.patch<{ data: Invoice }>(url, data),
  );

  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Failed to update invoice";

      return Effect.fail(new Error(errorMessage));
    }),
  );
};

export const deleteInvoice = async (
  invoiceId: string,
): Promise<{ success: boolean }> => {
  const url = `/api/merchant/invoices/${invoiceId}`;

  const program = fetchWithEffect<{ success: boolean }>(() =>
    apiClient.delete<{ success: boolean }>(url),
  );

  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Failed to delete invoice";

      return Effect.fail(new Error(errorMessage));
    }),
  );
};

const fetchMerchantInvoicesEffect = (
  merchantId: string,
): Effect.Effect<{ data: Invoice[] }, AxiosError | Error> => {
  const url = `/api/operator/merchants/${merchantId}/invoices`;

  return fetchWithEffect<unknown>(() => apiClient.get<unknown>(url)).pipe(
    Effect.flatMap((data) =>
      Effect.try({
        try: () => {
          if (data && typeof data === "object" && "data" in data) {
            return { data: data.data as Invoice[] };
          }
          return { data: data as Invoice[] };
        },
        catch: (error) =>
          new Error(`Schema validation failed: ${String(error)}`),
      }),
    ),
  );
};

export const fetchMerchantInvoices = async (
  merchantId: string,
): Promise<{ data: Invoice[] }> => {
  const program = fetchMerchantInvoicesEffect(merchantId);
  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error
          ? error.message
          : "Failed to fetch merchant invoices");

      return Effect.fail(new Error(errorMessage));
    }),
  );
};
