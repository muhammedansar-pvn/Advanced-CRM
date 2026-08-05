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
  Users,
  Plus,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  Inbox,
} from "lucide-react";
import { Customer } from "@/types";

const TABLE_SKELETON_ROWS = Array.from({ length: 6 });
const CARD_SKELETON_COUNT = Array.from({ length: 4 });

/* ── Shimmer Skeleton helpers ────────────────────────────── */
function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded ${className}`} aria-hidden="true" />;
}

function TableSkeleton() {
  return (
    <>
      {TABLE_SKELETON_ROWS.map((_, idx) => (
        <TableRow key={`skel-row-${idx}`} aria-hidden="true">
          <TableCell className="pr-0 pl-3">
            <SkeletonBlock className="h-4 w-4" />
          </TableCell>
          <TableCell>
            <SkeletonBlock className="h-9 w-9 rounded-full" />
          </TableCell>
          <TableCell>
            <SkeletonBlock className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <SkeletonBlock className="h-4 w-44" />
          </TableCell>
          <TableCell>
            <SkeletonBlock className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <SkeletonBlock className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <SkeletonBlock className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <SkeletonBlock className="h-4 w-24" />
          </TableCell>
          <TableCell className="text-right">
            <SkeletonBlock className="inline-block h-8 w-8 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function CardSkeletonItem() {
  return (
    <div
      className="border rounded-xl p-5 space-y-4 bg-card"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <SkeletonBlock className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-14 rounded-full" />
          </div>
        </div>
        <SkeletonBlock className="h-8 w-8 rounded-md" />
      </div>
      <div className="space-y-2.5 border-t pt-3.5">
        <SkeletonBlock className="h-3 w-36" />
        <SkeletonBlock className="h-3 w-44" />
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-7 w-full rounded-lg" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="Loading customers…">
      {CARD_SKELETON_COUNT.map((_, idx) => (
        <CardSkeletonItem key={`skel-card-${idx}`} />
      ))}
    </div>
  );
}

/* ── Empty States ─────────────────────────────────────────── */
function EmptyNoCustomers({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-slide-in"
      role="status"
      aria-label="No customers"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 border border-primary/12 mb-5">
        <Users className="h-8 w-8 text-primary/60" aria-hidden="true" />
      </div>
      <h3 className="font-bold text-base text-foreground mb-1.5">No customers yet</h3>
      <p className="text-sm text-muted-foreground max-w-[300px] leading-relaxed mb-6">
        Start building your customer base. Add your first contact to unlock the full CRM
        pipeline.
      </p>
      <Button
        onClick={onAdd}
        className="text-xs font-bold h-9 flex items-center space-x-1.5 shadow-sm"
        aria-label="Add your first customer"
      >
        <Plus className="h-4 w-4 stroke-[3]" aria-hidden="true" />
        <span>Add First Customer</span>
      </Button>
    </div>
  );
}

function EmptyNoResults({
  onReset,
  hasActiveFilters,
}: {
  onReset: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-slide-in"
      role="status"
      aria-label="No matching results"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 border border-border mb-5">
        <SearchX className="h-8 w-8 text-muted-foreground/60" aria-hidden="true" />
      </div>
      <h3 className="font-bold text-base text-foreground mb-1.5">No matching customers</h3>
      <p className="text-sm text-muted-foreground max-w-[300px] leading-relaxed mb-6">
        {hasActiveFilters
          ? "No records match your current filters or search query. Try adjusting or clearing your filters."
          : "No records match your search query. Try a different name, email, or company."}
      </p>
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onReset}
          className="text-xs h-9 font-semibold border-primary/20 text-primary hover:bg-primary/5"
          aria-label="Clear all active filters"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

function EmptyError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-slide-in"
      role="alert"
      aria-label="Failed to load customers"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/8 border border-destructive/15 mb-5">
        <AlertCircle className="h-8 w-8 text-destructive/70" aria-hidden="true" />
      </div>
      <h3 className="font-bold text-base text-foreground mb-1.5">Something went wrong</h3>
      <p className="text-sm text-muted-foreground max-w-[300px] leading-relaxed mb-6">
        We could not load customer data. This is likely a temporary issue with the local data
        source.
      </p>
      <Button
        onClick={onRetry}
        className="text-xs h-9 font-bold flex items-center space-x-1.5 shadow-sm"
        aria-label="Retry loading customers"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Try Again</span>
      </Button>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────── */
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
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoadingTimer(false), 400);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearchQuery(searchQuery), 150);
    return () => clearTimeout(id);
  }, [searchQuery]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, debouncedSearchQuery]);

  const handleSearchChange = React.useCallback((value: string) => setSearchQuery(value), []);
  const handlePageChange = React.useCallback((page: number) => setCurrentPage(page), []);
  const handlePageSizeChange = React.useCallback((size: number) => setPageSize(size), []);

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
    if (selectedCustomer) deleteCustomer(selectedCustomer.id);
  }, [selectedCustomer, deleteCustomer]);

  const handleFilterToggle = React.useCallback(() => setFilterSheetOpen((v) => !v), []);
  const handleFilterClose = React.useCallback(() => setFilterSheetOpen(false), []);

  const showSkeleton = isLoadingTimer || isQueryLoading;

  const searchedCustomers = React.useMemo(
    () => searchCustomers(orderedCustomers, debouncedSearchQuery),
    [orderedCustomers, debouncedSearchQuery]
  );

  const filteredCustomers = React.useMemo(
    () => filterCustomers(searchedCustomers, filters),
    [searchedCustomers, filters]
  );

  const sortedCustomers = React.useMemo(
    () => sortCustomers(filteredCustomers, sortKey, sortDirection),
    [filteredCustomers, sortKey, sortDirection]
  );

  const paginatedResult = React.useMemo(
    () => paginateCustomers(sortedCustomers, currentPage, pageSize),
    [sortedCustomers, currentPage, pageSize]
  );

  const sortableIds = React.useMemo(
    () => paginatedResult.items.map((c) => c.id),
    [paginatedResult.items]
  );

  const renderSortIcon = React.useCallback(
    (key: SortKey) => {
      if (sortKey !== key)
        return <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />;
      return sortDirection === "asc" ? (
        <ArrowUp className="ml-2 h-3.5 w-3.5 text-primary" aria-hidden="true" />
      ) : (
        <ArrowDown className="ml-2 h-3.5 w-3.5 text-primary" aria-hidden="true" />
      );
    },
    [sortKey, sortDirection]
  );

  const activeCustomer = React.useMemo<Customer | null>(
    () => (activeId ? orderedCustomers.find((c) => c.id === activeId) ?? null : null),
    [activeId, orderedCustomers]
  );

  const hasNoResults = sortedCustomers.length === 0;
  const hasNoCustomers = customers.length === 0;

  return (
    <div className="space-y-5 animate-fade-slide-in">
      {/* Filter Sheet (right slide-over) */}
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
        isOpen={filterSheetOpen}
        onClose={handleFilterClose}
      />

      {/* Toolbar */}
      <CustomerToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        activeFilterCount={activeFilterCount}
        filteredCount={isQueryError ? 0 : filteredCustomers.length}
        totalCount={isQueryError ? 0 : customers.length}
        onAddClick={openAddDialog}
        onFilterToggle={handleFilterToggle}
      />

      {/* Active filter badges */}
      {!hasNoCustomers && !isQueryError && activeFilterCount > 0 && (
        <div
          className="flex flex-wrap items-center gap-2 px-1 animate-in fade-in slide-in-from-top-1 duration-200"
          role="group"
          aria-label="Active filters"
        >
          <span className="text-xs font-semibold text-muted-foreground mr-1" aria-hidden="true">
            Active filters:
          </span>
          {filters.status.length > 0 && (
            <FilterBadge
              label="Status"
              value={filters.status.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
              onRemove={() => clearFilterField("status")}
            />
          )}
          {filters.companies.length > 0 && (
            <FilterBadge
              label="Company"
              value={
                filters.companies.length === 1
                  ? filters.companies[0]
                  : `${filters.companies.length} companies`
              }
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
              label="Date range"
              value={formatDateRange(filters.dateRange.start, filters.dateRange.end)}
              onRemove={() => clearFilterField("dateRange")}
            />
          )}
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-[11px] h-7 px-2.5 hover:bg-muted text-muted-foreground hover:text-foreground font-semibold"
            aria-label="Reset all filters"
          >
            Reset all
          </Button>
        </div>
      )}

      {/* Main table card */}
      <div
        className="bg-card border rounded-xl shadow-sm overflow-hidden"
        role="region"
        aria-label="Customer list"
      >
        {isQueryError ? (
          <EmptyError onRetry={() => refetch()} />
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="hidden md:block overflow-x-auto">
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
                      <TableHead className="w-[36px] pr-0 pl-3" aria-label="Drag handle" />
                      <TableHead className="w-[80px]">Avatar</TableHead>
                      <TableHead
                        onClick={() => handleSort("name")}
                        className="cursor-pointer select-none font-semibold text-foreground hover:bg-muted/50 transition-colors"
                        aria-sort={sortKey === "name" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleSort("name")}
                        role="columnheader"
                      >
                        <span className="flex items-center">
                          Name {renderSortIcon("name")}
                        </span>
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("email")}
                        className="cursor-pointer select-none font-semibold text-foreground hover:bg-muted/50 transition-colors"
                        aria-sort={sortKey === "email" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleSort("email")}
                        role="columnheader"
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
                        className="cursor-pointer select-none font-semibold text-foreground hover:bg-muted/50 transition-colors"
                        aria-sort={sortKey === "lastContact" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleSort("lastContact")}
                        role="columnheader"
                      >
                        <span className="flex items-center">
                          Last Contact {renderSortIcon("lastContact")}
                        </span>
                      </TableHead>
                      <TableHead className="text-right font-semibold text-foreground pr-4">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {showSkeleton ? (
                      <TableSkeleton />
                    ) : hasNoCustomers ? (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <EmptyNoCustomers onAdd={openAddDialog} />
                        </TableCell>
                      </TableRow>
                    ) : hasNoResults ? (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <EmptyNoResults
                            onReset={resetFilters}
                            hasActiveFilters={activeFilterCount > 0}
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
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

            {/* ── Mobile card grid ── */}
            <div className="block md:hidden p-4">
              {showSkeleton ? (
                <CardSkeleton />
              ) : hasNoCustomers ? (
                <EmptyNoCustomers onAdd={openAddDialog} />
              ) : hasNoResults ? (
                <EmptyNoResults
                  onReset={resetFilters}
                  hasActiveFilters={activeFilterCount > 0}
                />
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

            {/* Pagination */}
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

      {/* Dialogs */}
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
