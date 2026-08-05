import * as React from "react";
import { Button } from "@/components/ui/button";
import { getPresetFilters } from "@/data";
import { Zap } from "lucide-react";
import { CustomerFilters } from "@/types";

interface FilterActionsProps {
  onApplyPreset: (filters: CustomerFilters) => void;
}

export const FilterActions = React.memo(function FilterActions({
  onApplyPreset,
}: FilterActionsProps) {
  const presets = React.useMemo(() => getPresetFilters(), []);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Presets
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Filter presets">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            onClick={() => onApplyPreset(preset.filters)}
            className="justify-start text-left text-[11px] h-8 px-2.5 truncate font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-150"
            title={`Apply "${preset.label}" preset`}
            aria-label={`Apply ${preset.label} filter preset`}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
});
FilterActions.displayName = "FilterActions";
