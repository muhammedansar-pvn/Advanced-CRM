import * as React from "react";
import { Button } from "@/components/ui/button";
import { CustomerSearch } from "./customer-search";
import { ActiveFilterCount } from "@/components/filters";
import { Plus, Users, SlidersHorizontal } from "lucide-react";

interface CustomerToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
  onAddClick: () => void;
  onMobileFilterToggle: () => void;
}

export const CustomerToolbar = React.memo(function CustomerToolbar({
  searchQuery,
  onSearchChange,
  activeFilterCount,
  filteredCount,
  totalCount,
  onAddClick,
  onMobileFilterToggle,
}: CustomerToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border rounded-xl p-4 shadow-sm">
      {/* Search Input Bar */}
      <div className="w-full sm:flex-1">
        <CustomerSearch value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* Control Actions */}
      <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-end">
        {/* Tablet/Mobile Filters Toggle */}
        <Button
          variant="outline"
          onClick={onMobileFilterToggle}
          className="flex lg:hidden items-center space-x-1.5 text-xs font-semibold hover:bg-accent shrink-0 h-9"
          aria-label="Open filter options"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          <ActiveFilterCount count={activeFilterCount} />
        </Button>

        <div className="flex items-center space-x-2">
          {/* Total Record Count Display */}
          <div className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground bg-muted/30 px-3 py-1.5 border rounded-lg h-9">
            <Users className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>Showing {filteredCount} of {totalCount}</span>
          </div>

          {/* Add Customer Primary Trigger CTA */}
          <Button
            onClick={onAddClick}
            className="flex items-center space-x-1.5 text-xs font-bold shrink-0 h-9 bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm"
            aria-label="Add a new customer profile"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add Customer</span>
          </Button>
        </div>
      </div>
    </div>
  );
});
CustomerToolbar.displayName = "CustomerToolbar";
