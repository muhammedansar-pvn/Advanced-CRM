import { DashboardLayout } from "@/components/layout";
import { CustomerTableClientWrapper } from "@/components/customers/CustomerTableClientWrapper";

export default function CustomersPage() {
  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View, search, and manage customer contacts and engagement statistics.
          </p>
        </div>
      </div>

      <CustomerTableClientWrapper />
    </DashboardLayout>
  );
}
