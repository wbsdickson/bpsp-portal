export const merchantKeys = {
  all: ["merchants"] as const,
  lists: () => [...merchantKeys.all, "list"] as const,
  list: (params: any) => [...merchantKeys.lists(), params] as const,
  details: () => [...merchantKeys.all, "detail"] as const,
  detail: (id: string) => [...merchantKeys.details(), id] as const,
  fees: (id: string) => [...merchantKeys.detail(id), "fees"] as const,
  invoices: (id: string) => [...merchantKeys.detail(id), "invoices"] as const,
  members: (id: string) => [...merchantKeys.detail(id), "members"] as const,
};
