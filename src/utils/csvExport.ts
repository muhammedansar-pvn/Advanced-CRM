import { Customer } from "@/types";

function escapeCsvField(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportCustomersToCsv(customers: Customer[]): void {
  if (!customers || customers.length === 0) {
    throw new Error("No customer data available to export.");
  }

  const headers = ["Name", "Email", "Phone", "Company", "Status", "Last Contact", "Notes"];

  const rows = customers.map((c) => [
    escapeCsvField(c.name),
    escapeCsvField(c.email),
    escapeCsvField(c.phone),
    escapeCsvField(c.company),
    escapeCsvField(c.status),
    escapeCsvField(c.lastContact),
    escapeCsvField(c.notes || ""),
  ]);

  const csvContent =
    "\uFEFF" +
    [headers.map((h) => `"${h}"`).join(","), ...rows.map((row) => row.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split("T")[0];
  const filename = `customers-${today}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
