import { useQuery } from "@tanstack/react-query";
import { fetchMerchantInvoices } from "@/services/merchant-invoices-service";
import { merchantKeys } from "./query-keys";

export function useMerchantInvoicesApi(merchantId: string) {
  const query = useQuery({
    queryKey: merchantKeys.invoices(merchantId),
    queryFn: () => fetchMerchantInvoices(merchantId),
    enabled: !!merchantId,
  });

  return {
    invoices: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}
