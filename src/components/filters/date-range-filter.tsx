import * as React from "react";
import { Input } from "@/components/ui/input";

interface DateRangeFilterProps {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}

export const DateRangeFilter = React.memo(function DateRangeFilter({
  start,
  end,
  onChange,
}: DateRangeFilterProps) {
  const handleStartChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value, end);
    },
    [end, onChange]
  );

  const handleEndChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(start, e.target.value);
    },
    [start, onChange]
  );

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Last Contact Range
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Start</span>
          <Input
            type="date"
            value={start}
            onChange={handleStartChange}
            className="h-8 text-xs bg-muted/20 cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">End</span>
          <Input
            type="date"
            value={end}
            onChange={handleEndChange}
            className="h-8 text-xs bg-muted/20 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
});
DateRangeFilter.displayName = "DateRangeFilter";
