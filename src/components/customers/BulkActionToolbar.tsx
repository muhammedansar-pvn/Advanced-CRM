"use client";

import * as React from "react";
import { Trash2, X, CheckCircle2, XCircle, ChevronDown, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BulkActionToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onStatusChange: (status: "active" | "inactive") => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function BulkActionToolbar({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  onStatusChange,
  isDeleting = false,
  isUpdating = false,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-primary/5 dark:bg-primary/10 border-primary/20 p-3.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
      role="region"
      aria-label="Bulk actions toolbar"
    >
      <div className="flex items-center space-x-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">
          <CheckSquare className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">
            {selectedCount} customer{selectedCount === 1 ? "" : "s"} selected
          </p>
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Apply bulk changes or remove selected items across pages.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isUpdating || isDeleting}
              className="h-8 text-xs font-semibold bg-background hover:bg-accent border-border"
            >
              <span>Change Status</span>
              <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => onStatusChange("active")}
              className="flex items-center space-x-2 cursor-pointer text-xs font-medium"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Mark as Active</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange("inactive")}
              className="flex items-center space-x-2 cursor-pointer text-xs font-medium"
            >
              <XCircle className="h-3.5 w-3.5 text-slate-500" />
              <span>Mark as Inactive</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Action */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteSelected}
          disabled={isDeleting || isUpdating}
          className="h-8 text-xs font-semibold shadow-sm"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          <span>Delete ({selectedCount})</span>
        </Button>

        {/* Clear Selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 text-xs font-medium hover:bg-muted text-muted-foreground"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          <span>Clear</span>
        </Button>
      </div>
    </div>
  );
}
