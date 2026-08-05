import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerPaginationProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const CustomerPagination = React.memo(function CustomerPagination({
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: CustomerPaginationProps) {
  const handlePageSizeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onPageSizeChange(Number(e.target.value));
    },
    [onPageSizeChange]
  );

  const fromIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t">

      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        Showing <span className="font-medium text-foreground">{fromIndex}</span> to{" "}
        <span className="font-medium text-foreground">{toIndex}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span> customers
      </div>

      <div className="flex flex-row items-center space-x-6 order-1 sm:order-2">

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
CustomerPagination.displayName = "CustomerPagination";
