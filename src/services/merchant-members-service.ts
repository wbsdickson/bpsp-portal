import { Effect } from "effect";
import type { AxiosError } from "axios";
import { apiClient, fetchWithEffect } from "@/lib/api-client";
import type { User } from "@/lib/types";

export type MembersResponse = {
  data: User[];
};

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

// Effect-based API function
const fetchMerchantMembersEffect = (
  merchantId: string,
): Effect.Effect<MembersResponse, AxiosError> => {
  const url = `/api/operator/merchants/${merchantId}/members`;

  return fetchWithEffect<MembersResponse>(() =>
    apiClient.get<MembersResponse>(url),
  );
};

// Convert Effect to Promise for TanStack Query
export const fetchMerchantMembers = async (
  merchantId: string,
): Promise<MembersResponse> => {
  const program = fetchMerchantMembersEffect(merchantId);
  return Effect.runPromise(
    Effect.catchAll(program, (error: unknown) => {
      // Transform AxiosError to a more user-friendly error
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Failed to fetch merchant members";

      return Effect.fail(new Error(errorMessage));
    }),
  );
};
