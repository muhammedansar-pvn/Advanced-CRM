"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { customerService } from "@/services";

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: () => customerService.getCustomers(),

    placeholderData: keepPreviousData,

  });
}
