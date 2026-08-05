"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";
import { queryKeys } from "@/lib/queryKeys";
import { Customer } from "@/types";
import { toast } from "sonner";

interface BulkStatusVariables {
  ids: string[];
  status: "active" | "inactive";
}

export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: BulkStatusVariables) =>
      customerService.updateBulkCustomerStatus(ids, status),

    onMutate: async ({ ids, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.customers.all });

      const previousCustomers = queryClient.getQueryData<Customer[]>(queryKeys.customers.all);

      if (previousCustomers) {
        const idSet = new Set(ids);
        queryClient.setQueryData<Customer[]>(queryKeys.customers.all, (old = []) =>
          old.map((c) => (idSet.has(c.id) ? { ...c, status } : c))
        );
      }

      return { previousCustomers };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCustomers) {
        queryClient.setQueryData(queryKeys.customers.all, context.previousCustomers);
      }
      toast.error("Failed to update status for selected customers. Changes rolled back.");
    },

    onSuccess: (_data, variables) => {
      const statusLabel = variables.status === "active" ? "Active" : "Inactive";
      toast.success(
        `Updated status to "${statusLabel}" for ${variables.ids.length} customer${
          variables.ids.length === 1 ? "" : "s"
        }.`
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}
