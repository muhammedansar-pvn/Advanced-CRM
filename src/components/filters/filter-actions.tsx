import * as React from "react";
import { Button } from "@/components/ui/button";
import { getPresetFilters } from "@/data";
import { Sparkles } from "lucide-react";
import { CustomerFilters } from "@/types";

interface FilterActionsProps {
  onApplyPreset: (filters: CustomerFilters) => void;
}

export const FilterActions = React.memo(function FilterActions({
  onApplyPreset,
}: FilterActionsProps) {
  const presets = React.useMemo(() => getPresetFilters(), []);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        <span>Quick Presets</span>
      </h4>
      <div className="grid grid-cols-2 gap-1.5">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            onClick={() => onApplyPreset(preset.filters)}
            className="justify-start text-left text-[10px] h-8 px-2.5 py-1 truncate hover:bg-accent font-semibold text-foreground/80 hover:text-foreground"
            title={`Apply "${preset.label}" preset`}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
});
FilterActions.displayName = "FilterActions";
