import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SavedFilterConfig } from "@/types";
import { Save, Trash2, Edit2, Check, X } from "lucide-react";

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
    <div className="space-y-3 border-t pt-4">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Saved Filters
      </h4>

      {/* Save Current Filters Bar */}
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Save current filters..."
          value={newFilterName}
          onChange={(e) => setNewFilterName(e.target.value)}
          className="h-8 text-xs bg-muted/20"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleSave}
          disabled={!newFilterName.trim()}
          className="h-8 w-8 shrink-0 hover:bg-accent"
          aria-label="Save current filter configuration"
        >
          <Save className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Saved Filters list */}
      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
        {savedFilters.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-1">No saved filter sets.</p>
        ) : (
          savedFilters.map((config) => {
            const isEditing = editingId === config.id;
            return (
              <div
                key={config.id}
                className="flex items-center justify-between rounded-lg border p-2 bg-muted/5 group/item transition-colors hover:bg-muted/15"
              >
                {isEditing ? (
                  <div className="flex items-center space-x-1.5 w-full">
                    <Input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-7 text-xs px-1.5 py-0 bg-background"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
                      onClick={() => saveRename(config.id)}
                      aria-label="Confirm rename"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:bg-accent"
                      onClick={cancelEditing}
                      aria-label="Cancel rename"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <button
                      className="text-left text-xs font-semibold truncate max-w-[140px] text-foreground hover:underline cursor-pointer"
                      onClick={() => onLoad(config.id)}
                      title={`Load "${config.name}"`}
                    >
                      {config.name}
                    </button>
                    <div className="flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:bg-accent hover:text-foreground"
                        onClick={() => startEditing(config.id, config.name)}
                        aria-label="Rename saved filter"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(config.id)}
                        aria-label="Delete saved filter"
                      >
                        <Trash2 className="h-3 w-3" />
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
