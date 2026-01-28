export const autoIssuanceKeys = {
  all: ["autoIssuances"] as const,
  lists: () => [...autoIssuanceKeys.all, "list"] as const,
  list: (params: any) => [...autoIssuanceKeys.lists(), params] as const,
  details: () => [...autoIssuanceKeys.all, "detail"] as const,
  detail: (id: string) => [...autoIssuanceKeys.details(), id] as const,
};
