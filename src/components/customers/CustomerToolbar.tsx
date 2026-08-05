import * as React from "react";
import { Button } from "@/components/ui/button";
import { CustomerSearch } from "./customer-search";
import { ActiveFilterCount } from "@/components/filters";
import { Plus, Users, SlidersHorizontal, Download, Loader2 } from "lucide-react";

interface CustomerToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
  onAddClick: () => void;
  onFilterToggle: () => void;
  onExportClick?: () => void;
  isExporting?: boolean;
}

export const CustomerToolbar = React.memo(function CustomerToolbar({
  searchQuery,
  onSearchChange,
  activeFilterCount,
  filteredCount,
  totalCount,
  onAddClick,
  onFilterToggle,
  onExportClick,
  isExporting = false,
}: CustomerToolbarProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3 bg-card border rounded-xl px-4 py-3 shadow-sm"
      role="toolbar"
      aria-label="Customer list controls"
    >
      {/* Search — full width on mobile, flex-1 on desktop */}
      <div className="w-full sm:flex-1 sm:max-w-sm">
        <CustomerSearch value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-2 justify-between sm:justify-end flex-wrap">
        {/* Filters button */}
        <Button
          variant="outline"
          onClick={onFilterToggle}
          className="flex items-center gap-1.5 text-xs font-semibold h-9 hover:bg-accent transition-colors duration-150"
          aria-label={`Open filter options${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
          aria-pressed={activeFilterCount > 0}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <ActiveFilterCount count={activeFilterCount} />
          )}
        </Button>

        {/* Export CSV button */}
        {onExportClick && (
          <Button
            variant="outline"
            onClick={onExportClick}
            disabled={isExporting || filteredCount === 0}
            className="flex items-center gap-1.5 text-xs font-semibold h-9 hover:bg-accent transition-colors duration-150"
            aria-label="Export currently filtered customers to CSV"
          >
            {isExporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>Export CSV</span>
          </Button>
        )}

        {/* Count pill — hidden on smallest screens */}
        <div
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 border rounded-lg h-9 select-none"
          aria-live="polite"
          aria-label={`Showing ${filteredCount} of ${totalCount} customers`}
        >
          <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>
            {filteredCount} <span className="text-muted-foreground/60">/ {totalCount}</span>
          </span>
        </div>

        {/* Add Customer */}
        <Button
          onClick={onAddClick}
          className="flex items-center gap-1.5 text-xs font-bold h-9 shadow-sm transition-all duration-150 hover:shadow-md"
          aria-label="Add a new customer"
        >
          <Plus className="h-4 w-4 stroke-[3]" aria-hidden="true" />
          <span>Add Customer</span>
        </Button>
      </div>
    </div>
  );
});
CustomerToolbar.displayName = "CustomerToolbar";
