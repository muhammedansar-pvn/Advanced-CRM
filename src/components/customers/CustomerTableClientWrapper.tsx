"use client";

import dynamic from "next/dynamic";

const CustomerTable = dynamic(
  () =>
    import("@/components/customers/customer-table").then((m) => ({ default: m.CustomerTable })),
  { ssr: false }
);

export function CustomerTableClientWrapper() {
  return <CustomerTable />;
}
