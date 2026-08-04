import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CustomerStatus } from "@/types";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

export const CustomerStatusBadge = React.memo(function CustomerStatusBadge({
  status,
}: CustomerStatusBadgeProps) {
  const isActive = status === "active";

  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 capitalize px-2 py-0.5"
          : "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400 capitalize px-2 py-0.5"
      }
    >
      {status}
    </Badge>
  );
});
CustomerStatusBadge.displayName = "CustomerStatusBadge";
