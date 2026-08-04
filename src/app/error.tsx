"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-4 border border-amber-500/20">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          An unhandled application error occurred. Click below to refresh the page state.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    </DashboardLayout>
  );
}
