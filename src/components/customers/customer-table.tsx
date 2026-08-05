"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
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
import { SortableCustomerRow } from "./SortableCustomerRow";
import { SortableCustomerCard } from "./SortableCustomerCard";
import { CustomerToolbar } from "./CustomerToolbar";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import { FilterSidebar, FilterBadge, ActiveFilterCount } from "@/components/filters";
import { useCustomerFilters, useCustomerCrud } from "@/hooks";
import { useCustomerOrdering } from "@/hooks/useCustomerOrdering";
import {
  searchCustomers,
  sortCustomers,
  paginateCustomers,
  filterCustomers,
  formatDateRange,
  SortKey,
  SortDirection,
} from "@/utils";
import { CustomerFormValues } from "@/schemas/customerSchema";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SearchX,
  Inbox,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Customer } from "@/types";

const TABLE_SKELETON_ROWS = Array.from({ length: 5 });
const CARD_SKELETON_ROWS = Array.from({ length: 4 });

function TableSkeleton() {
  return (
    <>
      {TABLE_SKELETON_ROWS.map((_, idx) => (
        <TableRow key={`skeleton-row-${idx}`} className="animate-pulse">
          <TableCell><div className="h-4 w-4 rounded bg-muted" /></TableCell>
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
}

function CardSkeleton() {
  return (
    <>
      {CARD_SKELETON_ROWS.map((_, idx) => (
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
}

export function CustomerTable() {

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
    isLoading: isQueryLoading,
    isError: isQueryError,
    refetch,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCustomerCrud();

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

  const { orderedCustomers, handleDragEnd } = useCustomerOrdering(customers);

  const [searchQuery, setSearchQuery] = React.useState("");

  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isLoadingTimer, setIsLoadingTimer] = React.useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {

      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingTimer(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearchQuery(searchQuery), 150);
    return () => clearTimeout(id);
  }, [searchQuery]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, debouncedSearchQuery]);

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

  const handleFormSubmit = React.useCallback(
    (values: CustomerFormValues) => {
      if (dialogMode === "add") {
        addCustomer(values);
      } else if (dialogMode === "edit" && selectedCustomer) {
        editCustomer(selectedCustomer.id, values);
      }
    },
    [dialogMode, selectedCustomer, addCustomer, editCustomer]
  );

  const handleDeleteConfirm = React.useCallback(() => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id);
    }
  }, [selectedCustomer, deleteCustomer]);

  const handleMobileFilterOpen = React.useCallback(() => {
    setMobileFiltersOpen(true);
  }, []);

  const showSkeleton = isLoadingTimer || isQueryLoading;

  const searchedCustomers = React.useMemo(() => {
    return searchCustomers(orderedCustomers, debouncedSearchQuery);
  }, [orderedCustomers, debouncedSearchQuery]);

  const filteredCustomers = React.useMemo(() => {
    return filterCustomers(searchedCustomers, filters);
  }, [searchedCustomers, filters]);

  const sortedCustomers = React.useMemo(() => {
    return sortCustomers(filteredCustomers, sortKey, sortDirection);
  }, [filteredCustomers, sortKey, sortDirection]);

  const paginatedResult = React.useMemo(() => {
    return paginateCustomers(sortedCustomers, currentPage, pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  const sortableIds = React.useMemo(
    () => paginatedResult.items.map((c) => c.id),
    [paginatedResult.items]
  );

  const renderSortIcon = React.useCallback(
    (key: SortKey) => {
      if (sortKey !== key) {
        return (
          <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:scale-105" />
        );
      }
      return sortDirection === "asc" ? (
        <ArrowUp className="ml-2 h-3.5 w-3.5 text-primary" />
      ) : (
        <ArrowDown className="ml-2 h-3.5 w-3.5 text-primary" />
      );
    },
    [sortKey, sortDirection]
  );

  const activeCustomer = React.useMemo<Customer | null>(() => {
    if (!activeId) return null;
    return orderedCustomers.find((c) => c.id === activeId) ?? null;
  }, [activeId, orderedCustomers]);

  const hasNoResults = sortedCustomers.length === 0;
  const hasNoCustomers = customers.length === 0;

  return (
    <div className="space-y-6">

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
      />

      <div className="space-y-6">

        <CustomerToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          activeFilterCount={activeFilterCount}
          filteredCount={isQueryError ? 0 : filteredCustomers.length}
          totalCount={isQueryError ? 0 : customers.length}
          onAddClick={openAddDialog}
          onFilterToggle={handleMobileFilterOpen}
        />

        {!hasNoCustomers && !isQueryError && activeFilterCount > 0 && (
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

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          {isQueryError ? (

            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mb-3 animate-bounce" />
              <h3 className="font-semibold text-base text-foreground">Failed to load customers</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[280px] leading-relaxed font-medium">
                There was an error communicating with the local mock database.
              </p>
              <Button
                onClick={() => refetch()}
                className="mt-5 text-xs h-9 font-bold bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm flex items-center space-x-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Fetch</span>
              </Button>
            </div>
          ) : (
            <>

              <div className="hidden md:block">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                  onDragStart={(event) => setActiveId(event.active.id as string)}
                  onDragEnd={(event) => {
                    setActiveId(null);
                    handleDragEnd(event);
                  }}
                  onDragCancel={() => setActiveId(null)}
                >
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>

                        <TableHead className="w-[36px] pr-0 pl-3" />
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
                        <TableHead className="text-right font-semibold text-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {showSkeleton ? (
                        <TableSkeleton />
                      ) : hasNoCustomers ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-72 text-center">
                            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-muted-foreground">
                              <Inbox className="h-12 w-12 text-muted-foreground/40" />
                              <div>
                                <p className="font-semibold text-sm text-foreground">
                                  No customers registered yet
                                </p>
                                <p className="text-xs max-w-[280px] mx-auto mt-1 leading-relaxed">
                                  Your customer list is currently empty. Get started by adding your
                                  first customer contact.
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
                          <TableCell colSpan={9} className="h-72 text-center">
                            <div className="flex flex-col items-center justify-center py-10 space-y-3.5 text-muted-foreground">
                              <SearchX className="h-10 w-10 text-muted-foreground/50" />
                              <div>
                                <p className="font-semibold text-sm text-foreground">
                                  No matching customers
                                </p>
                                <p className="text-xs max-w-[280px] mx-auto mt-1 leading-relaxed">
                                  No records match the current filter configuration. Try adjusting
                                  your query or resetting all filters.
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
                        <SortableContext
                          items={sortableIds}
                          strategy={verticalListSortingStrategy}
                        >
                          {paginatedResult.items.map((customer) => (
                            <SortableCustomerRow
                              key={customer.id}
                              customer={customer}
                              onView={openViewDialog}
                              onEdit={openEditDialog}
                              onDelete={openDeleteDialog}
                            />
                          ))}
                        </SortableContext>
                      )}
                    </TableBody>
                  </Table>

                  <DragOverlay>
                    {activeCustomer ? (
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <CustomerRow
                            customer={activeCustomer}
                            layout="table"
                            onView={openViewDialog}
                            onEdit={openEditDialog}
                            onDelete={openDeleteDialog}
                          />
                        </tbody>
                      </table>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>

              <div className="block md:hidden p-4">
                {showSkeleton ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CardSkeleton />
                  </div>
                ) : hasNoCustomers ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-4">
                    <Inbox className="h-12 w-12 text-muted-foreground/40" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        No customers registered yet
                      </p>
                      <p className="text-xs max-w-[285px] mx-auto mt-1 leading-relaxed">
                        Your customer list is currently empty. Get started by adding your first
                        customer contact.
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
                        No records match the current filter configuration. Try adjusting your query
                        or resetting all filters.
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
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToWindowEdges]}
                    onDragStart={(event) => setActiveId(event.active.id as string)}
                    onDragEnd={(event) => {
                      setActiveId(null);
                      handleDragEnd(event);
                    }}
                    onDragCancel={() => setActiveId(null)}
                  >
                    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {paginatedResult.items.map((customer) => (
                          <SortableCustomerCard
                            key={customer.id}
                            customer={customer}
                            onView={openViewDialog}
                            onEdit={openEditDialog}
                            onDelete={openDeleteDialog}
                          />
                        ))}
                      </div>
                    </SortableContext>

                    <DragOverlay>
                      {activeCustomer ? (
                        <CustomerRow
                          customer={activeCustomer}
                          layout="card"
                          onView={openViewDialog}
                          onEdit={openEditDialog}
                          onDelete={openDeleteDialog}
                        />
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                )}
              </div>

              {!showSkeleton && !hasNoResults && !hasNoCustomers && (
                <CustomerPagination
                  currentPage={paginatedResult.currentPage}
                  pageSize={pageSize}
                  totalPages={paginatedResult.totalPages}
                  totalItems={paginatedResult.totalItems}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </div>
      </div>

      <CustomerFormDialog
        isOpen={dialogMode === "add" || dialogMode === "edit"}
        onClose={closeDialog}
        onSubmit={handleFormSubmit}
        defaultValues={dialogMode === "edit" && selectedCustomer ? selectedCustomer : undefined}
        mode={dialogMode === "edit" ? "edit" : "add"}
        isSubmitting={isCreating || isUpdating}
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
        isDeleting={isDeleting}
      />
    </div>
  );
}
