import { useQuery } from "@tanstack/react-query";
import { fetchMerchantFees } from "@/services/merchant-fees-service";

export function useMerchantFeesApi(merchantId: string) {
  const query = useQuery({
    queryKey: ["merchant-fees", merchantId],
    queryFn: () => fetchMerchantFees(merchantId),
    enabled: !!merchantId,
  });

  return {
    fees: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}
