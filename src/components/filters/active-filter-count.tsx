import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface ActiveFilterCountProps {
  count: number;
}

export const ActiveFilterCount = React.memo(function ActiveFilterCount({
  count,
}: ActiveFilterCountProps) {
  if (count === 0) return null;

  return (
    <Badge
      variant="secondary"
      className="h-5 px-1.5 text-[10px] font-bold bg-primary/10 text-primary border-primary/20 rounded-md"
    >
      {count}
    </Badge>
  );
});
ActiveFilterCount.displayName = "ActiveFilterCount";
