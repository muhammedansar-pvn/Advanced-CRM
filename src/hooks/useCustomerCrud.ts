"use client";

import { useState, useCallback } from "react";
import { Customer } from "@/types";
import { CustomerFormValues } from "@/schemas/customerSchema";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "./";

export type DialogMode = "add" | "edit" | "view" | "delete" | "none";

export function useCustomerCrud() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>("none");

  const { data: customers = [], isLoading, isError, refetch } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const openAddDialog = useCallback(() => {
    setSelectedCustomer(null);
    setDialogMode("add");
  }, []);

  const openEditDialog = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogMode("edit");
  }, []);

  const openViewDialog = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogMode("view");
  }, []);

  const openDeleteDialog = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogMode("delete");
  }, []);

  const closeDialog = useCallback(() => {
    setDialogMode("none");
    setSelectedCustomer(null);
  }, []);

  const { mutate: createMutate } = createMutation;
  const { mutate: updateMutate } = updateMutation;
  const { mutate: deleteMutate } = deleteMutation;

  const addCustomer = useCallback(
    (values: CustomerFormValues) => {
      createMutate(values, {
        onSuccess: () => {
          closeDialog();
        },
      });
    },
    [createMutate, closeDialog]
  );

  const editCustomer = useCallback(
    (id: string, values: CustomerFormValues) => {
      updateMutate(
        { id, values },
        {
          onSuccess: () => {
            closeDialog();
          },
        }
      );
    },
    [updateMutate, closeDialog]
  );

  const deleteCustomer = useCallback(
    (id: string) => {
      deleteMutate(id, {
        onSuccess: () => {
          closeDialog();
        },
      });
    },
    [deleteMutate, closeDialog]
  );

  return {
    customers,
    selectedCustomer,
    dialogMode,
    openAddDialog,
    openEditDialog,
    openViewDialog,
    openDeleteDialog,
    closeDialog,
    addCustomer,
    editCustomer,
    deleteCustomer,
    isLoading,
    isError,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
