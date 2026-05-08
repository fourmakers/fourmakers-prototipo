import { GripVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@/hooks/useColumnReorder";

interface DraggableTableHeadProps {
  columnId: string;
  children: React.ReactNode;
  className?: string;
  isDragging?: boolean;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onDragStart: (columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (columnId: string) => void;
  onDragEnd: () => void;
  onSort?: (columnId: string) => void;
  sticky?: boolean;
  stickyRightOffset?: number;
  stickyLeft?: boolean;
  stickyLeftOffset?: number;
  align?: "left" | "center" | "right";
}

export const DraggableTableHead = ({
  columnId,
  children,
  className,
  isDragging,
  sortable = true,
  sortDirection,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onSort,
  sticky = false,
  stickyRightOffset,
  stickyLeft = false,
  stickyLeftOffset,
  align = "left",
}: DraggableTableHeadProps) => {
  const SortIcon =
    sortDirection === "asc" ? ArrowUp : sortDirection === "desc" ? ArrowDown : ArrowUpDown;

  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  const justifyClass =
    align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";

  return (
    <TableHead
      className={cn(
        "relative group select-none",
        alignClass,
        isDragging && "opacity-50",
        sticky &&
          "sticky z-30 min-w-[180px] bg-surface-elevated sticky-col-shadow-fixed",
        stickyLeft &&
          "sticky bg-surface-elevated z-10 shadow-[inset_1px_0_0_0_var(--color-border-default)]",
        className
      )}
      style={
        stickyLeft && stickyLeftOffset !== undefined
          ? { left: `${stickyLeftOffset}px`, position: "sticky" as const, zIndex: 10 }
          : sticky
            ? { right: `${stickyRightOffset ?? 0}px`, position: "sticky" as const, zIndex: 30 }
            : undefined
      }
      draggable
      onDragStart={() => onDragStart(columnId)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(columnId)}
      onDragEnd={onDragEnd}
    >
      <div className={cn("flex items-center gap-2", justifyClass)}>
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0" />
        <span className={cn("flex-1", alignClass)}>{children}</span>
        {sortable && onSort && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSort(columnId);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
          >
            <SortIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </TableHead>
  );
};
