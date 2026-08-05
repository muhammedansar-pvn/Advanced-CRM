"use client";

import { useState, useCallback } from "react";

export function useCustomerSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastIndex, setLastIndex] = useState<number | null>(null);

  const toggleSelect = useCallback(
    (id: string, index?: number, isShift?: boolean, pageIds?: string[]) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);

        if (isShift && lastIndex !== null && index !== undefined && pageIds) {
          const start = Math.min(lastIndex, index);
          const end = Math.max(lastIndex, index);
          const rangeIds = pageIds.slice(start, end + 1);

          const shouldSelect = !next.has(id);
          rangeIds.forEach((rangeId) => {
            if (shouldSelect) {
              next.add(rangeId);
            } else {
              next.delete(rangeId);
            }
          });
        } else {
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
        }

        return next;
      });

      if (index !== undefined) {
        setLastIndex(index);
      }
    },
    [lastIndex]
  );

  const toggleSelectAllPage = useCallback((pageIds: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = pageIds.every((id) => next.has(id));

      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }

      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setLastIndex(null);
  }, []);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    toggleSelect,
    toggleSelectAllPage,
    clearSelection,
    isSelected,
  };
}
