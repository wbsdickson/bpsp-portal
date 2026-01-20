import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMerchantById, updateMerchant } from "@/services/merchants-service";
import type { AppMerchant } from "@/types/merchant";
import { merchantKeys } from "./query-keys";

export function useMerchantApi(merchantId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: merchantKeys.detail(merchantId),
    queryFn: () => fetchMerchantById(merchantId),
    enabled: !!merchantId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<AppMerchant>) =>
      updateMerchant(merchantId, data),
    onSuccess: () => {
      // Invalidate and refetch merchant data
      queryClient.invalidateQueries({ queryKey: merchantKeys.detail(merchantId) });
      // Also invalidate merchants list to keep it in sync
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });

  return {
    merchant: query.data?.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
    updateMerchant: (
      data: Partial<AppMerchant>,
      options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      },
    ) => {
      updateMutation.mutate(data, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: merchantKeys.detail(merchantId) });
          queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
          options?.onSuccess?.();
        },
        onError: (error) => {
          options?.onError?.(error instanceof Error ? error : new Error(String(error)));
        },
      });
    },
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
