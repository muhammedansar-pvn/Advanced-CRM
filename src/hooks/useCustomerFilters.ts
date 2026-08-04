"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CustomerFilters, SavedFilterConfig, CustomerStatus } from "@/types";
import { initialFilters } from "@/data/presetFilters";

const LOCAL_STORAGE_KEY = "apex_crm_saved_filters";

export function useCustomerFilters() {
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters);
  const [savedFilters, setSavedFilters] = useState<SavedFilterConfig[]>([]);

  // Load saved filters from localStorage safely after mount (SSR Safe)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          setSavedFilters(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse saved filters", e);
        }
      }
    }
  }, []);

  // Save filters helper
  const updateSavedFiltersInStorage = useCallback((updated: SavedFilterConfig[]) => {
    setSavedFilters(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  }, []);

  const updateFilters = useCallback((updater: Partial<CustomerFilters> | ((prev: CustomerFilters) => CustomerFilters)) => {
    setFilters((prev) => {
      if (typeof updater === "function") {
        return updater(prev);
      }
      return { ...prev, ...updater };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Preset Handlers
  const applyPreset = useCallback((presetFilters: CustomerFilters) => {
    setFilters(presetFilters);
  }, []);

  // Save current configuration
  const saveCurrentFilter = useCallback((name: string) => {
    if (!name.trim()) return;

    const newSavedFilter: SavedFilterConfig = {
      id: `filter_${Date.now()}`,
      name: name.trim(),
      filters: JSON.parse(JSON.stringify(filters)), // deep copy
      createdAt: new Date().toISOString(),
    };

    updateSavedFiltersInStorage([...savedFilters, newSavedFilter]);
  }, [filters, savedFilters, updateSavedFiltersInStorage]);

  // Delete saved configuration
  const deleteSavedFilter = useCallback((id: string) => {
    const updated = savedFilters.filter((f) => f.id !== id);
    updateSavedFiltersInStorage(updated);
  }, [savedFilters, updateSavedFiltersInStorage]);

  // Rename saved configuration
  const renameSavedFilter = useCallback((id: string, newName: string) => {
    if (!newName.trim()) return;
    const updated = savedFilters.map((f) =>
      f.id === id ? { ...f, name: newName.trim() } : f
    );
    updateSavedFiltersInStorage(updated);
  }, [savedFilters, updateSavedFiltersInStorage]);

  // Load saved configuration
  const loadSavedFilter = useCallback((id: string) => {
    const found = savedFilters.find((f) => f.id === id);
    if (found) {
      setFilters(found.filters);
    }
  }, [savedFilters]);

  // Active filter count calculations
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status.length > 0) count++;
    if (filters.companies.length > 0) count++;
    if (filters.email.trim() !== "") count++;
    if (filters.phone.trim() !== "") count++;
    if (filters.dateRange.start !== "" || filters.dateRange.end !== "") count++;
    return count;
  }, [filters]);

  // Clear specific filter field
  const clearFilterField = useCallback((field: keyof CustomerFilters) => {
    setFilters((prev) => {
      if (field === "status") return { ...prev, status: [] };
      if (field === "companies") return { ...prev, companies: [] };
      if (field === "email") return { ...prev, email: "" };
      if (field === "phone") return { ...prev, phone: "" };
      if (field === "dateRange") return { ...prev, dateRange: { start: "", end: "" } };
      return prev;
    });
  }, []);

  return {
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
  };
}
