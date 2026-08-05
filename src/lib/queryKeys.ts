import { CustomerFilters } from "@/types";

export const queryKeys = {
  customers: {
    all: ["customers"] as const,
    lists: () => ["customers", "list"] as const,
    list: (filters: CustomerFilters, search: string) =>
      ["customers", "list", { filters, search }] as const,
    details: () => ["customers", "detail"] as const,
    detail: (id: string) => ["customers", "detail", id] as const,
  },
};
export type QueryKeys = typeof queryKeys;
