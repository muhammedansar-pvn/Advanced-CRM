"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { customerService } from "@/services";
import { Customer } from "@/types";
import { toast } from "sonner";
import { getQueryErrorMessage } from "@/lib/queryError";

interface UpdateParams {
  id: string;
  values: Partial<Customer>;
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: UpdateParams) =>
      customerService.updateCustomer(id, values),
    onMutate: async ({ id, values }) => {

      await queryClient.cancelQueries({ queryKey: queryKeys.customers.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.customers.detail(id) });

      const previousCustomers = queryClient.getQueryData<Customer[]>(queryKeys.customers.all);
      const previousCustomer = queryClient.getQueryData<Customer>(queryKeys.customers.detail(id));

      if (previousCustomers) {
        queryClient.setQueryData<Customer[]>(
          queryKeys.customers.all,
          previousCustomers.map((c) => (c.id === id ? { ...c, ...values } : c))
        );
      }

      if (previousCustomer) {
        queryClient.setQueryData<Customer>(
          queryKeys.customers.detail(id),
          { ...previousCustomer, ...values }
        );
      }

      return { previousCustomers, previousCustomer, id };
    },
    onError: (error, _variables, context) => {

      if (context?.previousCustomers) {
        queryClient.setQueryData(queryKeys.customers.all, context.previousCustomers);
      }
      if (context?.previousCustomer) {
        queryClient.setQueryData(queryKeys.customers.detail(context.id), context.previousCustomer);
      }
      toast.error(getQueryErrorMessage(error, "Failed to update customer."));
    },
    onSuccess: (customer, variables) => {
      queryClient.setQueryData(queryKeys.customers.detail(variables.id), customer);
      toast.success("Customer Updated Successfully");
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.id) });
    },
  });
}
