import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CustomerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const CustomerSearch = React.memo(function CustomerSearch({
  value,
  onChange,
}: CustomerSearchProps) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  const handleClear = React.useCallback(() => onChange(""), [onChange]);

  return (
    <div className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder="Search by name, email, or company…"
        value={value}
        onChange={handleChange}
        className="pl-9 pr-9 transition-shadow duration-150 focus-visible:shadow-sm"
        aria-label="Search customers"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 hover:bg-accent text-muted-foreground transition-colors duration-150"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
});
CustomerSearch.displayName = "CustomerSearch";
