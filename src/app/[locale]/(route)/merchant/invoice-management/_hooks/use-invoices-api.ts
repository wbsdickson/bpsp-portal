import { useQuery } from "@tanstack/react-query";

import {
  getAllInvoices,
  type InvoicesApiParams,
} from "@/services/merchant-invoices-service";
import { invoiceKeys } from "./query-keys";

export type UseInvoicesApiParams = InvoicesApiParams;

export function useInvoicesApi(params: UseInvoicesApiParams) {
  const query = useQuery({
    queryKey: invoiceKeys.list(params),
    queryFn: () => getAllInvoices(params),
  });

  return {
    invoices: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}
