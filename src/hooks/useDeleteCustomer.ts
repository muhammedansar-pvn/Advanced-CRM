"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { customerService } from "@/services";
import { Customer } from "@/types";
import { toast } from "sonner";
import { getQueryErrorMessage } from "@/lib/queryError";

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onMutate: async (id) => {

      await queryClient.cancelQueries({ queryKey: queryKeys.customers.all });

      const previousCustomers = queryClient.getQueryData<Customer[]>(queryKeys.customers.all);

      if (previousCustomers) {
        queryClient.setQueryData<Customer[]>(
          queryKeys.customers.all,
          previousCustomers.filter((c) => c.id !== id)
        );
      }

      return { previousCustomers };
    },
    onError: (error, _id, context) => {

      if (context?.previousCustomers) {
        queryClient.setQueryData(queryKeys.customers.all, context.previousCustomers);
      }
      toast.error(getQueryErrorMessage(error, "Failed to delete customer."));
    },
    onSuccess: () => {
      toast.success("Customer Deleted Successfully");
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.removeQueries({ queryKey: queryKeys.customers.detail(id) });
    },
  });
}
