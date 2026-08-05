import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SavedFilterConfig } from "@/types";
import { Save, Trash2, Edit2, Check, X, Bookmark } from "lucide-react";

interface SavedFiltersProps {
  savedFilters: SavedFilterConfig[];
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onLoad: (id: string) => void;
}

export const SavedFilters = React.memo(function SavedFilters({
  savedFilters,
  onSave,
  onDelete,
  onRename,
  onLoad,
}: SavedFiltersProps) {
  const [newFilterName, setNewFilterName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState("");

  const handleSave = React.useCallback(() => {
    if (!newFilterName.trim()) return;
    onSave(newFilterName);
    setNewFilterName("");
  }, [newFilterName, onSave]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSave();
    },
    [handleSave]
  );

  const startEditing = React.useCallback((id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  }, []);

  const cancelEditing = React.useCallback(() => {
    setEditingId(null);
    setEditingName("");
  }, []);

  const saveRename = React.useCallback(
    (id: string) => {
      if (!editingName.trim()) return;
      onRename(id, editingName);
      setEditingId(null);
      setEditingName("");
    },
    [editingName, onRename]
  );

  return (
    <div className="space-y-3 border-t pt-5">
      {/* Section title */}
      <div className="flex items-center gap-1.5">
        <Bookmark className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Saved Filters
        </h4>
      </div>

      {/* Save new filter input */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Name and save current filters…"
          value={newFilterName}
          onChange={(e) => setNewFilterName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-8 text-xs bg-muted/20"
          aria-label="Name for saved filter set"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleSave}
          disabled={!newFilterName.trim()}
          className="h-8 w-8 shrink-0 hover:bg-accent transition-colors duration-150"
          aria-label="Save current filter configuration"
        >
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>

      {/* Saved filter list */}
      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5" role="list" aria-label="Saved filter sets">
        {savedFilters.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-5 px-3 text-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/10">
            <Bookmark className="h-5 w-5 text-muted-foreground/30 mb-1.5" aria-hidden="true" />
            <p className="text-xs font-medium text-muted-foreground">No saved filters yet</p>
            <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-relaxed">
              Apply filters above and save them for quick reuse.
            </p>
          </div>
        ) : (
          savedFilters.map((config) => {
            const isEditing = editingId === config.id;
            return (
              <div
                key={config.id}
                className="flex items-center justify-between rounded-lg border px-2.5 py-2 bg-muted/5 group/item transition-colors hover:bg-muted/20 hover:border-muted-foreground/20"
                role="listitem"
              >
                {isEditing ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <Input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename(config.id);
                        if (e.key === "Escape") cancelEditing();
                      }}
                      className="h-7 text-xs px-1.5 py-0 bg-background"
                      autoFocus
                      aria-label="Rename filter"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-emerald-600 hover:bg-emerald-500/10"
                      onClick={() => saveRename(config.id)}
                      aria-label="Confirm rename"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:bg-accent"
                      onClick={cancelEditing}
                      aria-label="Cancel rename"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <button
                      className="text-left text-xs font-semibold truncate max-w-[150px] text-foreground hover:underline focus-visible:outline-none focus-visible:underline cursor-pointer"
                      onClick={() => onLoad(config.id)}
                      title={`Load "${config.name}"`}
                      aria-label={`Load filter: ${config.name}`}
                    >
                      {config.name}
                    </button>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:bg-accent hover:text-foreground"
                        onClick={() => startEditing(config.id, config.name)}
                        aria-label={`Rename "${config.name}"`}
                      >
                        <Edit2 className="h-3 w-3" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(config.id)}
                        aria-label={`Delete "${config.name}"`}
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
SavedFilters.displayName = "SavedFilters";
