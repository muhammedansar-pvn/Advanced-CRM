import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

interface DragHandleProps {

  id: string;
}

export const DragHandle = React.memo(function DragHandle({ id }: DragHandleProps) {
  const { listeners, attributes } = useSortable({ id });

  return (
    <button
      type="button"
      className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground/40 hover:text-muted-foreground transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Drag to reorder"
      {...listeners}
      {...attributes}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
});
DragHandle.displayName = "DragHandle";
