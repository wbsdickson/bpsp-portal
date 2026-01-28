import { Effect } from "effect";
import type { AxiosError } from "axios";
import { apiClient, fetchWithEffect } from "@/lib/api-client";
import type { InvoiceAutoIssuance } from "@/types/invoice";
import {
  autoIssuancesResponseSchema,
  autoIssuanceResponseSchema,
} from "@/app/[locale]/(route)/merchant/invoice-auto-issuance/_lib/auto-issuance-schema";

export type AutoIssuancesResponse = {
  data: InvoiceAutoIssuance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type AutoIssuancesApiParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "scheduleName" | "targetClient" | "nextIssuanceDate" | "createdAt";
  sortOrder?: "asc" | "desc";
};

const fetchAutoIssuancesEffect = (
  params: AutoIssuancesApiParams,
): Effect.Effect<AutoIssuancesResponse, AxiosError | Error> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryString = searchParams.toString();
  const url = `/api/merchant/invoice-auto-issuances${
    queryString ? `?${queryString}` : ""
  }`;

  return fetchWithEffect<unknown>(() => apiClient.get<unknown>(url)).pipe(
    Effect.flatMap((data) =>
      Effect.try({
        try: () => autoIssuancesResponseSchema.parse(data),
        catch: (error) =>
          new Error(`Schema validation failed: ${String(error)}`),
      }),
    ),
    Effect.map((validatedData) => validatedData as AutoIssuancesResponse),
  );
};

export const getAllAutoIssuances = async (
  params: AutoIssuancesApiParams,
): Promise<AutoIssuancesResponse> => {
  const program = fetchAutoIssuancesEffect(params);
  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error
          ? error.message
          : "Failed to fetch auto issuances");

      throw new Error(errorMessage);
    }),
  );
};

export const getAutoIssuanceById = async (id: string) => {
  const program = fetchWithEffect<unknown>(() =>
    apiClient.get<unknown>(`/api/merchant/invoice-auto-issuances/${id}`),
  ).pipe(
    Effect.flatMap((data) =>
      Effect.try({
        try: () => autoIssuanceResponseSchema.parse(data),
        catch: (error) =>
          new Error(`Schema validation failed: ${String(error)}`),
      }),
    ),
    Effect.map((validatedData) => validatedData.data),
  );

  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error
          ? error.message
          : "Failed to fetch auto issuance");

      throw new Error(errorMessage);
    }),
  );
};

export const createAutoIssuance = async (
  data: Omit<InvoiceAutoIssuance, "id" | "createdAt" | "updatedAt">,
) => {
  const program = fetchWithEffect<unknown>(() =>
    apiClient.post<unknown>("/api/merchant/invoice-auto-issuances", data),
  ).pipe(
    Effect.flatMap((data) =>
      Effect.try({
        try: () => autoIssuanceResponseSchema.parse(data),
        catch: (error) =>
          new Error(`Schema validation failed: ${String(error)}`),
      }),
    ),
    Effect.map((validatedData) => validatedData.data),
  );

  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create auto issuance");

      throw new Error(errorMessage);
    }),
  );
};

export const updateAutoIssuance = async (
  id: string,
  data: Partial<InvoiceAutoIssuance>,
) => {
  const program = fetchWithEffect<unknown>(() =>
    apiClient.patch<unknown>(
      `/api/merchant/invoice-auto-issuances/${id}`,
      data,
    ),
  ).pipe(
    Effect.flatMap((data) =>
      Effect.try({
        try: () => autoIssuanceResponseSchema.parse(data),
        catch: (error) =>
          new Error(`Schema validation failed: ${String(error)}`),
      }),
    ),
    Effect.map((validatedData) => validatedData.data),
  );

  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error
          ? error.message
          : "Failed to update auto issuance");

      throw new Error(errorMessage);
    }),
  );
};

export const deleteAutoIssuance = async (id: string) => {
  const program = fetchWithEffect<unknown>(() =>
    apiClient.delete<unknown>(`/api/merchant/invoice-auto-issuances/${id}`),
  );

  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        (error instanceof Error
          ? error.message
          : "Failed to delete auto issuance");

      throw new Error(errorMessage);
    }),
  );
};
