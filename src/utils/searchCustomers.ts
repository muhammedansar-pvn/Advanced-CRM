import { Customer } from "@/types";

export function searchCustomers(customers: Customer[], query: string): Customer[] {
  if (!query) return customers;
  const lowerQuery = query.toLowerCase().trim();

  return customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.company.toLowerCase().includes(lowerQuery)
  );
}
