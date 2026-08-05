import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { StatusFilter } from "./status-filter";
import { CompanyFilter } from "./company-filter";
import { EmailFilter } from "./email-filter";
import { PhoneFilter } from "./phone-filter";
import { DateRangeFilter } from "./date-range-filter";
import { SavedFilters } from "./saved-filters";
import { FilterActions } from "./filter-actions";
import { CustomerFilters, SavedFilterConfig } from "@/types";
import { Trash2, SlidersHorizontal } from "lucide-react";

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
  isOpen: boolean;
  onClose: () => void;
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
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const handleStatusChange = React.useCallback(
    (status: CustomerFilters["status"]) => updateFilters({ status }),
    [updateFilters]
  );
  const handleCompaniesChange = React.useCallback(
    (companies: CustomerFilters["companies"]) => updateFilters({ companies }),
    [updateFilters]
  );
  const handleEmailChange = React.useCallback(
    (email: string) => updateFilters({ email }),
    [updateFilters]
  );
  const handlePhoneChange = React.useCallback(
    (phone: string) => updateFilters({ phone }),
    [updateFilters]
  );
  const handleDateRangeChange = React.useCallback(
    (start: string, end: string) => updateFilters({ dateRange: { start, end } }),
    [updateFilters]
  );
  const handleOpenChange = React.useCallback(
    (open: boolean) => { if (!open) onClose(); },
    [onClose]
  );

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-[320px] sm:w-[380px] flex flex-col p-0 overflow-hidden gap-0"
        aria-label="Advanced filters panel"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 border border-primary/12">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              </div>
              <SheetTitle className="text-sm font-semibold text-foreground">
                Advanced Filters
              </SheetTitle>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 px-2 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-1"
                aria-label="Clear all filters"
              >
                <Trash2 className="h-3 w-3" aria-hidden="true" />
                <span>Clear all</span>
              </Button>
            )}
          </div>
          <SheetDescription className="text-xs text-muted-foreground text-left mt-1">
            Narrow your customer list using the options below.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Quick presets */}
          <FilterActions onApplyPreset={applyPreset} />

          {/* Filter fields */}
          <div className="space-y-5">
            <StatusFilter
              selectedStatus={filters.status}
              onChange={handleStatusChange}
            />
            <CompanyFilter
              selectedCompanies={filters.companies}
              onChange={handleCompaniesChange}
            />
            <EmailFilter
              value={filters.email}
              onChange={handleEmailChange}
            />
            <PhoneFilter
              value={filters.phone}
              onChange={handlePhoneChange}
            />
            <DateRangeFilter
              start={filters.dateRange.start}
              end={filters.dateRange.end}
              onChange={handleDateRangeChange}
            />
          </div>

          {/* Saved filters */}
          <SavedFilters
            savedFilters={savedFilters}
            onSave={saveCurrentFilter}
            onDelete={deleteSavedFilter}
            onRename={renameSavedFilter}
            onLoad={loadSavedFilter}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
});
FilterSidebar.displayName = "FilterSidebar";
