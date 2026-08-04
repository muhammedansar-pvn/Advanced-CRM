"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CustomerPagination } from "./customer-pagination";
import { CustomerRow } from "./customer-row";
import { CustomerToolbar } from "./CustomerToolbar";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import { FilterSidebar, FilterBadge, ActiveFilterCount } from "@/components/filters";
import { useCustomerFilters, useCustomerCrud } from "@/hooks";
import { searchCustomers, sortCustomers, paginateCustomers, filterCustomers, formatDateRange, SortKey, SortDirection } from "@/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, Users, SearchX, Inbox, SlidersHorizontal, Plus } from "lucide-react";
import { Toaster } from "sonner";

export function CustomerTable() {
  // 1. Hook for all CRUD operations & Modal Dialog states
  const {
    customers,
    selectedCustomer,
    dialogMode,
    openAddDialog,
    openEditDialog,
    openViewDialog,
    openDeleteDialog,
    closeDialog,
    addCustomer,
    editCustomer,
    deleteCustomer,
  } = useCustomerCrud();

  // 2. Hook for all Filtering operations
  const {
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
    clearFilterField,
  } = useCustomerFilters();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  // Short simulation to show the Skeleton loading state on first load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Reset page to 1 when filters or search queries change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = React.useCallback((size: number) => {
    setPageSize(size);
  }, []);

  const handleSort = React.useCallback((key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
      } else {
        setSortDirection("asc");
      }
      return key;
    });
  }, []);

  // Submit Handler for Customer creation/editing
  const handleFormSubmit = React.useCallback((values: any) => {
    if (dialogMode === "add") {
      addCustomer(values);
    } else if (dialogMode === "edit" && selectedCustomer) {
      editCustomer(selectedCustomer.id, values);
    }
  }, [dialogMode, selectedCustomer, addCustomer, editCustomer]);

  // Submit Handler for Deletion
  const handleDeleteConfirm = React.useCallback(() => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id);
    }
  }, [selectedCustomer, deleteCustomer]);

  // Performance Optimization: Compute search, filter, sort and pagination via useMemo
  const searchedCustomers = React.useMemo(() => {
    return searchCustomers(customers, searchQuery);
  }, [customers, searchQuery]);

  const filteredCustomers = React.useMemo(() => {
    return filterCustomers(searchedCustomers, filters);
  }, [searchedCustomers, filters]);

  const sortedCustomers = React.useMemo(() => {
    return sortCustomers(filteredCustomers, sortKey, sortDirection);
  }, [filteredCustomers, sortKey, sortDirection]);

  const paginatedResult = React.useMemo(() => {
    return paginateCustomers(sortedCustomers, currentPage, pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  // Sort arrow renderer helper
  const renderSortIcon = React.useCallback((key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:scale-105" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-3.5 w-3.5 text-primary" />
    );
  }, [sortKey, sortDirection]);

  // Skeleton table rows (Desktop)
  const TableSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, idx) => (
        <TableRow key={`skeleton-row-${idx}`} className="animate-pulse">
          <TableCell><div className="h-9 w-9 rounded-full bg-muted" /></TableCell>
          <TableCell><div className="h-4 w-28 rounded bg-muted" /></TableCell>
          <TableCell><div className="h-4 w-40 rounded bg-muted" /></TableCell>
          <TableCell><div className="h-4 w-28 rounded bg-muted" /></TableCell>
          <TableCell><div className="h-4 w-24 rounded bg-muted" /></TableCell>
          <TableCell><div className="h-5 w-16 rounded bg-muted" /></TableCell>
          <TableCell><div className="h-4 w-24 rounded bg-muted" /></TableCell>
          <TableCell className="text-right"><div className="inline-block h-8 w-8 rounded bg-muted" /></TableCell>
        </TableRow>
      ))}
    </>
  );

  // Skeleton cards (Mobile)
  const CardSkeleton = () => (
    <>
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={`skeleton-card-${idx}`} className="border rounded-xl p-5 space-y-4 animate-pulse bg-card">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          </div>
          <div className="space-y-2 border-t pt-4">
            <div className="h-3 w-40 rounded bg-muted" />
            <div className="h-3 w-48 rounded bg-muted" />
            <div className="h-3 w-32 rounded bg-muted" />
          </div>
        </div>
      ))}
    </>
  );

  const hasNoResults = sortedCustomers.length === 0;
  const hasNoCustomers = customers.length === 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      {/* Sonner Toaster component with premium styling */}
      <Toaster position="top-right" richColors theme="light" />

      {/* 1. Desktop Permanent Filter Sidebar */}
      {!hasNoCustomers && (
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            savedFilters={savedFilters}
            activeFilterCount={activeFilterCount}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
            applyPreset={applyPreset}
            saveCurrentFilter={saveCurrentFilter}
            deleteSavedFilter={deleteSavedFilter}
            renameSavedFilter={renameSavedFilter}
            loadSavedFilter={loadSavedFilter}
          />
        </div>
      )}

      {/* 2. Mobile/Tablet Slide-over Filter Sheet Drawer */}
      {!hasNoCustomers && (
        <FilterSidebar
          filters={filters}
          savedFilters={savedFilters}
          activeFilterCount={activeFilterCount}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          applyPreset={applyPreset}
          saveCurrentFilter={saveCurrentFilter}
          deleteSavedFilter={deleteSavedFilter}
          renameSavedFilter={renameSavedFilter}
          loadSavedFilter={loadSavedFilter}
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          isMobile
        />
      )}

      {/* 3. Main content area (Toolbar, Badges, Table) */}
      <div className="flex-1 space-y-6 overflow-hidden">
        {/* Reusable Customer Toolbar replacing the old static panel */}
        <CustomerToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          activeFilterCount={activeFilterCount}
          filteredCount={filteredCustomers.length}
          totalCount={customers.length}
          onAddClick={openAddDialog}
          onMobileFilterToggle={() => setMobileFiltersOpen(true)}
        />

        {/* Applied Filter Badges panel */}
        {!hasNoCustomers && activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-1 py-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Active Filters:</span>
            {filters.status.length > 0 && (
              <FilterBadge
                label="Status"
                value={filters.status.join(", ")}
                onRemove={() => clearFilterField("status")}
              />
            )}
            {filters.companies.length > 0 && (
              <FilterBadge
                label="Companies"
                value={filters.companies.join(", ")}
                onRemove={() => clearFilterField("companies")}
              />
            )}
            {filters.email.trim() !== "" && (
              <FilterBadge
                label="Email"
                value={filters.email}
                onRemove={() => clearFilterField("email")}
              />
            )}
            {filters.phone.trim() !== "" && (
              <FilterBadge
                label="Phone"
                value={filters.phone}
                onRemove={() => clearFilterField("phone")}
              />
            )}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <FilterBadge
                label="Contact Date"
                value={formatDateRange(filters.dateRange.start, filters.dateRange.end)}
                onRemove={() => clearFilterField("dateRange")}
              />
            )}
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-[11px] h-7 px-2 hover:bg-muted text-muted-foreground hover:text-foreground font-semibold"
            >
              Reset
            </Button>
          </div>
        )}

        {/* Data list Table Card */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead
                    onClick={() => handleSort("name")}
                    className="cursor-pointer select-none group font-semibold text-foreground hover:bg-muted/40 transition-colors"
                  >
                    <span className="flex items-center">
                      Name {renderSortIcon("name")}
                    </span>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("email")}
                    className="cursor-pointer select-none group font-semibold text-foreground hover:bg-muted/40 transition-colors"
                  >
                    <span className="flex items-center">
                      Email {renderSortIcon("email")}
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">Phone</TableHead>
                  <TableHead className="font-semibold text-foreground">Company</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead
                    onClick={() => handleSort("lastContact")}
                    className="cursor-pointer select-none group font-semibold text-foreground hover:bg-muted/40 transition-colors"
                  >
                    <span className="flex items-center">
                      Last Contact {renderSortIcon("lastContact")}
                    </span>
                  </TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : hasNoCustomers ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-72 text-center">
                      <div className="flex flex-col items-center justify-center py-10 space-y-4 text-muted-foreground">
                        <Inbox className="h-12 w-12 text-muted-foreground/40" />
                        <div>
                          <p className="font-semibold text-sm text-foreground">No customers registered yet</p>
                          <p className="text-xs max-w-[280px] mx-auto mt-1 leading-relaxed">
                            Your customer list is currently empty. Get started by adding your first customer contact.
                          </p>
                        </div>
                        <Button
                          onClick={openAddDialog}
                          className="text-xs h-9 font-semibold bg-primary hover:bg-primary/95 text-primary-foreground flex items-center space-x-1.5 shadow-sm"
                        >
                          <Plus className="h-4 w-4 stroke-[3]" />
                          <span>Add Your First Customer</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : hasNoResults ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-72 text-center">
                      <div className="flex flex-col items-center justify-center py-10 space-y-3.5 text-muted-foreground">
                        <SearchX className="h-10 w-10 text-muted-foreground/50" />
                        <div>
                          <p className="font-semibold text-sm text-foreground">No matching customers</p>
                          <p className="text-xs max-w-[280px] mx-auto mt-1 leading-relaxed">
                            No records match the current filter configuration. Try adjusting your query or resetting all filters.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={resetFilters}
                          className="text-xs h-8 hover:bg-accent border-primary/20 text-primary"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedResult.items.map((customer) => (
                    <CustomerRow
                      key={customer.id}
                      customer={customer}
                      layout="table"
                      onView={openViewDialog}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Grid Cards View */}
          <div className="block md:hidden p-4">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <CardSkeleton />
              </div>
            ) : hasNoCustomers ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-4">
                <Inbox className="h-12 w-12 text-muted-foreground/40" />
                <div>
                  <p className="font-semibold text-sm text-foreground">No customers registered yet</p>
                  <p className="text-xs max-w-[285px] mx-auto mt-1 leading-relaxed">
                    Your customer list is currently empty. Get started by adding your first customer contact.
                  </p>
                </div>
                <Button
                  onClick={openAddDialog}
                  className="text-xs h-9 font-semibold bg-primary hover:bg-primary/95 text-primary-foreground flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>Add First Customer</span>
                </Button>
              </div>
            ) : hasNoResults ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground space-y-3.5">
                <SearchX className="h-10 w-10 text-muted-foreground/50" />
                <div>
                  <p className="font-semibold text-sm text-foreground">No matching customers</p>
                  <p className="text-xs max-w-[280px] mx-auto mt-1 leading-relaxed">
                    No records match the current filter configuration. Try adjusting your query or resetting all filters.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="text-xs h-8 hover:bg-accent border-primary/20 text-primary"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {paginatedResult.items.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    layout="card"
                    onView={openViewDialog}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer Controls: Pagination bar */}
          {!isLoading && !hasNoResults && !hasNoCustomers && (
            <CustomerPagination
              currentPage={paginatedResult.currentPage}
              pageSize={pageSize}
              totalPages={paginatedResult.totalPages}
              totalItems={paginatedResult.totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>

      {/* 4. CRUD Modals Mounting Portals */}
      <CustomerFormDialog
        isOpen={dialogMode === "add" || dialogMode === "edit"}
        onClose={closeDialog}
        onSubmit={handleFormSubmit}
        defaultValues={dialogMode === "edit" && selectedCustomer ? selectedCustomer : undefined}
        mode={dialogMode === "edit" ? "edit" : "add"}
      />

      <CustomerDetailsDialog
        isOpen={dialogMode === "view"}
        onClose={closeDialog}
        customer={selectedCustomer}
      />

      <DeleteCustomerDialog
        isOpen={dialogMode === "delete"}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        customer={selectedCustomer}
      />
    </div>
  );
}
