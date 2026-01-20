import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  fetchMerchants,
  type MerchantsApiParams,
} from "@/services/merchants-service";

export type UseMerchantsApiParams = MerchantsApiParams;

export function useMerchantsApi(params: UseMerchantsApiParams) {
  // Memoize query key to prevent unnecessary refetches
  const queryKey = useMemo(
    () => ["merchants", params],
    [
      params.page,
      params.limit,
      params.status,
      params.search,
      params.sortBy,
      params.sortOrder,
    ],
  );

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMerchants(params),
  });

  return {
    merchants: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}
