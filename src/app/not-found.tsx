import Link from "next/link";
import { DashboardLayout } from "@/components/layout";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-4 border border-rose-500/20">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          The requested CRM page or resource could not be found or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </DashboardLayout>
  );
}
