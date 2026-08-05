"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";
import { queryKeys } from "@/lib/queryKeys";
import { Customer } from "@/types";
import { toast } from "sonner";

export function useBulkDeleteCustomers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => customerService.deleteBulkCustomers(ids),

    onMutate: async (deletedIds) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.customers.all });

      const previousCustomers = queryClient.getQueryData<Customer[]>(queryKeys.customers.all);

      if (previousCustomers) {
        const idSet = new Set(deletedIds);
        queryClient.setQueryData<Customer[]>(queryKeys.customers.all, (old = []) =>
          old.filter((c) => !idSet.has(c.id))
        );
      }

      return { previousCustomers };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCustomers) {
        queryClient.setQueryData(queryKeys.customers.all, context.previousCustomers);
      }
      toast.error("Failed to delete selected customers. Changes rolled back.");
    },

    onSuccess: (deletedIds) => {
      toast.success(`Successfully deleted ${deletedIds.length} customer${deletedIds.length === 1 ? "" : "s"}.`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}
