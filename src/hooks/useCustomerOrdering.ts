"use client";

import { useState, useEffect, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import { Customer } from "@/types";
import { queryKeys } from "@/lib/queryKeys";
import { customerOrderService } from "@/services/customerOrderService";

export function useCustomerOrdering(customers: Customer[]) {
  const queryClient = useQueryClient();
  const [orderedCustomers, setOrderedCustomers] = useState<Customer[]>(customers);

  useEffect(() => {
    const savedOrder = customerOrderService.readOrder();
    if (savedOrder && savedOrder.length > 0) {
      setOrderedCustomers(customerOrderService.applyOrder(customers, savedOrder));
    } else {
      setOrderedCustomers(customers);
    }
  }, [customers]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setOrderedCustomers((prev) => {
        const oldIndex = prev.findIndex((c) => c.id === active.id);
        const newIndex = prev.findIndex((c) => c.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const reordered = arrayMove(prev, oldIndex, newIndex);

        customerOrderService.writeOrder(reordered.map((c) => c.id));

        queryClient.setQueryData<Customer[]>(queryKeys.customers.all, reordered);

        return reordered;
      });
    },
    [queryClient]
  );

  const resetOrder = useCallback(() => {
    customerOrderService.clearOrder();

    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
  }, [queryClient]);

  return {
    orderedCustomers,
    handleDragEnd,
    resetOrder,
  };
}
