import * as React from "react";
import { Input } from "@/components/ui/input";

interface EmailFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmailFilter = React.memo(function EmailFilter({
  value,
  onChange,
}: EmailFilterProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Email Address
      </h4>
      <Input
        type="text"
        placeholder="Filter by email contains..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 text-xs placeholder:text-muted-foreground bg-muted/20"
      />
    </div>
  );
});
EmailFilter.displayName = "EmailFilter";
