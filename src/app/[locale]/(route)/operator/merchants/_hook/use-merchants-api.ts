import { useQuery } from "@tanstack/react-query";

import {
  fetchMerchants,
  type MerchantsApiParams,
} from "@/services/merchants-service";
import { merchantKeys } from "./query-keys";

export type UseMerchantsApiParams = MerchantsApiParams;

export function useMerchantsApi(params: UseMerchantsApiParams) {
  const query = useQuery({
    queryKey: merchantKeys.list(params),
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
