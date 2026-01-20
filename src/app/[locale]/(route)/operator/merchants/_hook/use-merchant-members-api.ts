import { useQuery } from "@tanstack/react-query";

import { fetchMerchantMembers } from "@/services/merchant-members-service";
import { merchantKeys } from "./query-keys";

export function useMerchantMembersApi(merchantId: string) {
  const query = useQuery({
    queryKey: merchantKeys.members(merchantId),
    queryFn: () => fetchMerchantMembers(merchantId),
    enabled: !!merchantId, 
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
