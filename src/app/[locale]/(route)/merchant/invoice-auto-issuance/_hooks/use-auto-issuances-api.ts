import { useQuery } from "@tanstack/react-query";

import {
  getAllAutoIssuances,
  type AutoIssuancesApiParams,
} from "@/services/merchant-auto-issuance-service";
import { autoIssuanceKeys } from "./query-keys";

export type UseAutoIssuancesApiParams = AutoIssuancesApiParams;

export function useAutoIssuancesApi(params: UseAutoIssuancesApiParams) {
  const query = useQuery({
    queryKey: autoIssuanceKeys.list(params),
    queryFn: () => getAllAutoIssuances(params),
  });

  return {
    autoIssuances: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}
