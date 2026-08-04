import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusFilter } from "./status-filter";
import { CompanyFilter } from "./company-filter";
import { EmailFilter } from "./email-filter";
import { PhoneFilter } from "./phone-filter";
import { DateRangeFilter } from "./date-range-filter";
import { SavedFilters } from "./saved-filters";
import { FilterActions } from "./filter-actions";
import { CustomerFilters, SavedFilterConfig } from "@/types";
import { Trash2, Filter } from "lucide-react";

interface FilterSidebarProps {
  filters: CustomerFilters;
  savedFilters: SavedFilterConfig[];
  activeFilterCount: number;
  updateFilters: (updater: Partial<CustomerFilters>) => void;
  resetFilters: () => void;
  applyPreset: (filters: CustomerFilters) => void;
  saveCurrentFilter: (name: string) => void;
  deleteSavedFilter: (id: string) => void;
  renameSavedFilter: (id: string, newName: string) => void;
  loadSavedFilter: (id: string) => void;
  isOpen?: boolean; // Mobile sheet toggle
  onClose?: () => void; // Mobile sheet close
  isMobile?: boolean; // Inline layout vs. overlay layout
}

export const FilterSidebar = React.memo(function FilterSidebar({
  filters,
  savedFilters,
  activeFilterCount,
  updateFilters,
  resetFilters,
  applyPreset,
  saveCurrentFilter,
  deleteSavedFilter,
  renameSavedFilter,
  loadSavedFilter,
  isOpen = false,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  // Shared inner contents of the filters panel
  const filterContent = React.useMemo(() => (
    <div className="space-y-6">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Advanced Filters</h3>
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-7 px-2 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center space-x-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear All</span>
          </Button>
        )}
      </div>

      {/* Preset Filters */}
      <FilterActions onApplyPreset={applyPreset} />

      {/* Filters Stack */}
      <div className="space-y-5">
        <StatusFilter
          selectedStatus={filters.status}
          onChange={(status) => updateFilters({ status })}
        />
        <CompanyFilter
          selectedCompanies={filters.companies}
          onChange={(companies) => updateFilters({ companies })}
        />
        <EmailFilter
          value={filters.email}
          onChange={(email) => updateFilters({ email })}
        />
        <PhoneFilter
          value={filters.phone}
          onChange={(phone) => updateFilters({ phone })}
        />
        <DateRangeFilter
          start={filters.dateRange.start}
          end={filters.dateRange.end}
          onChange={(start, end) => updateFilters({ dateRange: { start, end } })}
        />
      </div>

      {/* Local Storage Saved Filters Panel */}
      <SavedFilters
        savedFilters={savedFilters}
        onSave={saveCurrentFilter}
        onDelete={deleteSavedFilter}
        onRename={renameSavedFilter}
        onLoad={loadSavedFilter}
      />
    </div>
  ), [
    filters,
    savedFilters,
    activeFilterCount,
    updateFilters,
    resetFilters,
    applyPreset,
    saveCurrentFilter,
    deleteSavedFilter,
    renameSavedFilter,
    loadSavedFilter,
  ]);

  // If mobile, render as a Radix Sheet drawer
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose && onClose()}>
        <SheetContent side="right" className="w-[320px] sm:w-[350px] overflow-y-auto z-50">
          <SheetHeader className="pb-2 border-b">
            <SheetTitle className="text-left font-bold">Filters Overview</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {filterContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // If desktop/tablet inline view, render as a standard aside panel
  return (
    <aside className="w-64 shrink-0 bg-card border rounded-xl p-5 shadow-sm overflow-y-auto max-h-[calc(100vh-8.5rem)] sticky top-24">
      {filterContent}
    </aside>
  );
});
FilterSidebar.displayName = "FilterSidebar";
