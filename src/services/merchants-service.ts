import { Effect } from "effect";
import type { AxiosError } from "axios";
import { apiClient, fetchWithEffect } from "@/lib/api-client";
import type { AppMerchant, MerchantStatus } from "@/types/merchant";
import {
  merchantResponseSchema,
  merchantsResponseSchema,
} from "@/app/[locale]/(route)/operator/merchants/_lib/merchant-schema";

export type MerchantsResponse = {
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

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type MerchantsApiParams = {
  page?: number;
  limit?: number;
  status?: MerchantStatus;
  search?: string;
  sortBy?: "name" | "createdAt" | "transactionCount";
  sortOrder?: "asc" | "desc";
};

// Effect-based API function
const fetchMerchantsEffect = (
  params: MerchantsApiParams,
): Effect.Effect<MerchantsResponse, AxiosError | Error> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryString = searchParams.toString();
  const url = `/api/operator/merchants${queryString ? `?${queryString}` : ""}`;

  return fetchWithEffect<unknown>(() => apiClient.get<unknown>(url)).pipe(
    Effect.flatMap((data) =>
      Effect.try({
        try: () => merchantsResponseSchema.parse(data),
        catch: (error) =>
          new Error(`Schema validation failed: ${String(error)}`),
      }),
    ),
    Effect.map((validatedData) => validatedData as MerchantsResponse),
  );
};

// Convert Effect to Promise for TanStack Query
export const getAllMerchants = async (
  params: MerchantsApiParams,
): Promise<MerchantsResponse> => {
  const program = fetchMerchantsEffect(params);
  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      // Transform AxiosError to a more user-friendly error
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error ? error.message : "Failed to fetch merchants");

      return Effect.fail(new Error(errorMessage));
    }),
  );
};

// Effect-based API function for fetching a single merchant
const fetchMerchantByIdEffect = (
  merchantId: string,
): Effect.Effect<{ data: AppMerchant }, AxiosError | Error> => {
  const url = `/api/operator/merchants/${merchantId}`;

  return fetchWithEffect<unknown>(() => apiClient.get<unknown>(url)).pipe(
    Effect.flatMap((data) =>
      Effect.try({
        try: () => merchantResponseSchema.parse(data),
        catch: (error) =>
          new Error(`Schema validation failed: ${String(error)}`),
      }),
    ),
    Effect.map((validatedData) => validatedData as { data: AppMerchant }),
  );
};

// Fetch a single merchant by ID
export const fetchMerchantById = async (
  merchantId: string,
): Promise<{ data: AppMerchant }> => {
  const program = fetchMerchantByIdEffect(merchantId);
  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error ? error.message : "Failed to fetch merchant");

      return Effect.fail(new Error(errorMessage));
    }),
  );
};

// Update merchant
export const updateMerchant = async (
  merchantId: string,
  data: Partial<AppMerchant>,
): Promise<{ data: AppMerchant }> => {
  const url = `/api/operator/merchants/${merchantId}`;

  const program = fetchWithEffect<{ data: AppMerchant }>(() =>
    apiClient.patch<{ data: AppMerchant }>(url, data),
  );

  // We are not validating the UPDATE response strictly here for brevity,
  // but in a full implementation we should use merchantResponseSchema here too.

  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Failed to update merchant";

      return Effect.fail(new Error(errorMessage));
    }),
  );
};
