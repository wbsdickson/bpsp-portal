import { useQuery } from "@tanstack/react-query";

import { fetchMerchantMembers } from "@/services/merchant-members-service";

export function useMerchantMembersApi(merchantId: string) {
  const query = useQuery({
    queryKey: ["merchant-members", merchantId],
    queryFn: () => fetchMerchantMembers(merchantId),
    enabled: !!merchantId, // Only fetch if merchantId is provided
  });

  return {
    members: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}
