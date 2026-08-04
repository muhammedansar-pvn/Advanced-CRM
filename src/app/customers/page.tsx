import { DashboardLayout } from "@/components/layout";
import { CustomerTable } from "@/components/customers";

export default function CustomersPage() {
  return (
    <DashboardLayout>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">
            View, search, and manage customer contacts and engagement statistics.
          </p>
        </div>
      </div>

      {/* Table Orchestrator */}
      <CustomerTable />
    </DashboardLayout>
  );
}
