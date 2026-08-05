"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { customerService } from "@/services";
import { Customer } from "@/types";

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,

    select: (data: Customer) => ({
      ...data,
      displayLabel: `${data.name} (${data.company})`,
    }),
  });
}
