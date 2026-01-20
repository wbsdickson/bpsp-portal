import { Effect } from "effect";
import type { AxiosError } from "axios";
import { apiClient, fetchWithEffect } from "@/lib/api-client";
import type { AppMerchantFee } from "@/types/merchant-fee";

export type FeesResponse = {
  data: AppMerchantFee[];
};

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

// Effect-based API function
const fetchMerchantFeesEffect = (
  merchantId: string,
): Effect.Effect<FeesResponse, AxiosError> => {
  const url = `/api/operator/merchants/${merchantId}/fees`;

  return fetchWithEffect<FeesResponse>(() =>
    apiClient.get<FeesResponse>(url),
  );
};

// Convert Effect to Promise for TanStack Query
export const fetchMerchantFees = async (
  merchantId: string,
): Promise<FeesResponse> => {
  const program = fetchMerchantFeesEffect(merchantId);
  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Failed to fetch merchant fees";

      return Effect.fail(new Error(errorMessage));
    }),
  );
};
