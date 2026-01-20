import { Effect } from "effect";
import type { AxiosError } from "axios";
import { apiClient, fetchWithEffect } from "@/lib/api-client";
import type { Invoice } from "@/types/invoice";

export type InvoicesResponse = {
  data: Invoice[];
};

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

// Effect-based API function
const fetchMerchantInvoicesEffect = (
  merchantId: string,
): Effect.Effect<InvoicesResponse, AxiosError> => {
  const url = `/api/operator/merchants/${merchantId}/invoices`;

  return fetchWithEffect<InvoicesResponse>(() =>
    apiClient.get<InvoicesResponse>(url),
  );
};

// Convert Effect to Promise for TanStack Query
export const fetchMerchantInvoices = async (
  merchantId: string,
): Promise<InvoicesResponse> => {
  const program = fetchMerchantInvoicesEffect(merchantId);
  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Failed to fetch merchant invoices";

      return Effect.fail(new Error(errorMessage));
    }),
  );
};
