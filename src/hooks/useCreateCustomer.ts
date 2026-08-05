"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { customerService } from "@/services";
import { Customer } from "@/types";
import { toast } from "sonner";
import { getQueryErrorMessage } from "@/lib/queryError";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Omit<Customer, "id" | "lastContact">) =>
      customerService.createCustomer(values),
    onMutate: async (newCustomerValues) => {

      await queryClient.cancelQueries({ queryKey: queryKeys.customers.all });

      const previousCustomers = queryClient.getQueryData<Customer[]>(queryKeys.customers.all);

      if (previousCustomers) {
        const tempCustomer: Customer = {
          ...newCustomerValues,
          id: `temp_${Date.now()}`,
          lastContact: new Date().toISOString().split("T")[0],
        };
        queryClient.setQueryData<Customer[]>(
          queryKeys.customers.all,
          [tempCustomer, ...previousCustomers]
        );
      }

      return { previousCustomers };
    },
    onError: (error, _newCustomer, context) => {

      if (context?.previousCustomers) {
        queryClient.setQueryData(queryKeys.customers.all, context.previousCustomers);
      }
      toast.error(getQueryErrorMessage(error, "Failed to add customer."));
    },
    onSuccess: (customer) => {
      queryClient.setQueryData<Customer[]>(queryKeys.customers.all, (customers = []) => [
        customer,
        ...customers.filter((item) => !item.id.startsWith("temp_")),
      ]);
      toast.success("Customer Added Successfully");
    },
    onSettled: () => {

      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}
