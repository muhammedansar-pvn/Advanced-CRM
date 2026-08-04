import { Customer } from "@/types";

export interface PaginatedResult {
  items: Customer[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export function paginateCustomers(
  customers: Customer[],
  page: number,
  pageSize: number
): PaginatedResult {
  const totalItems = customers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = customers.slice(startIndex, endIndex);

  return {
    items,
    totalItems,
    totalPages,
    currentPage,
  };
}
