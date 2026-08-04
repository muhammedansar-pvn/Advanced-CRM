import { Customer } from "@/types";

export type SortKey = "name" | "email" | "lastContact";
export type SortDirection = "asc" | "desc";

export function sortCustomers(
  customers: Customer[],
  key: SortKey,
  direction: SortDirection
): Customer[] {
  const sorted = [...customers];

  sorted.sort((a, b) => {
    let valA = a[key] || "";
    let valB = b[key] || "";

    valA = valA.toString().toLowerCase();
    valB = valB.toString().toLowerCase();

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}
