"use client";

import { useState, useCallback } from "react";
import { Customer } from "@/types";
import { mockCustomers } from "@/data";
import { toast } from "sonner";
import { CustomerFormValues } from "@/schemas/customerSchema";

export type DialogMode = "add" | "edit" | "view" | "delete" | "none";

export function useCustomerCrud() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>("none");

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

  // CRUD operation: ADD
  const addCustomer = useCallback((values: CustomerFormValues) => {
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      company: values.company.trim(),
      status: values.status,
      notes: values.notes?.trim() || "",
      avatar: values.avatar?.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(values.name)}`,
      lastContact: new Date().toISOString().split("T")[0], // Prefilled as today
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    toast.success("Customer Added Successfully");
    closeDialog();
  }, [closeDialog]);

  // CRUD operation: EDIT
  const editCustomer = useCallback((id: string, values: CustomerFormValues) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: values.name.trim(),
              email: values.email.trim().toLowerCase(),
              phone: values.phone.trim(),
              company: values.company.trim(),
              status: values.status,
              notes: values.notes?.trim() || "",
              avatar: values.avatar?.trim() || c.avatar,
            }
          : c
      )
    );
    toast.success("Customer Updated Successfully");
    closeDialog();
  }, [closeDialog]);

  // CRUD operation: DELETE
  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast.success("Customer Deleted Successfully");
    closeDialog();
  }, [closeDialog]);

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
  };
}
