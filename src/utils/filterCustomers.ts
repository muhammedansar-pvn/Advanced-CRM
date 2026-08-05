import { Customer, CustomerFilters } from "@/types";
import { isDateWithinRange } from "./dateUtils";

export function filterCustomers(
  customers: Customer[],
  filters: CustomerFilters
): Customer[] {
  return customers.filter((customer) => {

    if (filters.status.length > 0 && !filters.status.includes(customer.status)) {
      return false;
    }

    if (filters.companies.length > 0 && !filters.companies.includes(customer.company)) {
      return false;
    }

    if (filters.email) {
      const emailQuery = filters.email.toLowerCase().trim();
      if (!customer.email.toLowerCase().includes(emailQuery)) {
        return false;
      }
    }

    if (filters.phone) {
      const phoneQuery = filters.phone.toLowerCase().trim();
      if (!customer.phone.toLowerCase().includes(phoneQuery)) {
        return false;
      }
    }

    if (filters.dateRange.start || filters.dateRange.end) {
      if (!isDateWithinRange(customer.lastContact, filters.dateRange.start, filters.dateRange.end)) {
        return false;
      }
    }

    return true;
  });
}
