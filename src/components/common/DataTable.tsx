import { isValidElement, type ReactNode } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { DraggableTableHead } from "./DraggableTableHead";
import { useColumnReorder } from "@/hooks/useColumnReorder";
import type { Column, InitialSortState } from "@/hooks/useColumnReorder";
import { cn } from "@/lib/utils";

export type { Column };

function getColumnWidthPx(column: Column): number {
  const w = column.width;
  if (!w) return 120;
  const match = w.match(/(?:min-)?w-\[(\d+)px\]|w-\[(\d+)px\]/);
  if (match) return parseInt(match[1] ?? match[2] ?? "120", 10);
  const tail = w.match(/w-(\d+)/);
  if (tail) return Math.max(80, parseInt(tail[1], 10) * 4);
  return 120;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  renderCell: (item: T, columnId: string) => ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  defaultSort?: InitialSortState | null;
  stickyColumnId?: string;
  stickyRightColumnIds?: string[];
  stickyLeftColumnIds?: string[];
  onRowClick?: (item: T) => void;
  stickyHeader?: boolean;
  getCellClassName?: (columnId: string) => string;
  centerEmptyMessage?: boolean;
  dense?: boolean;
}

export function DataTable<T = unknown>({
  columns: initialColumns,
  data,
  renderCell,
  keyExtractor,
  emptyMessage = "Nenhum registro encontrado",
  defaultSort = null,
  stickyColumnId,
  stickyRightColumnIds,
  stickyLeftColumnIds = [],
  onRowClick,
  stickyHeader = true,
  getCellClassName,
  centerEmptyMessage = false,
  dense = false,
}: DataTableProps<T>) {
  const {
    columns,
    draggedColumn,
    sortState,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleSort,
    sortData,
  } = useColumnReorder(initialColumns, defaultSort);

  const sortedData = sortData(data);

  const stickyRightSet = stickyRightColumnIds ? new Set(stickyRightColumnIds) : null;
  const getStickyRightOffset = (columnId: string): number | undefined => {
    if (!stickyRightColumnIds?.length) return undefined;
    const idx = stickyRightColumnIds.indexOf(columnId);
    if (idx < 0) return undefined;
    let offset = 0;
    for (let i = 0; i < idx; i++) {
      const col = columns.find((c) => c.id === stickyRightColumnIds[i]);
      if (col) offset += getColumnWidthPx(col);
    }
    return offset;
  };
  const isStickyRightCol = (columnId: string) =>
    stickyRightSet ? stickyRightSet.has(columnId) : columnId === stickyColumnId;
  const leftmostStickyRightIndex = stickyRightColumnIds?.length
    ? columns.findIndex((c) => c.id === stickyRightColumnIds[stickyRightColumnIds.length - 1])
    : stickyColumnId
      ? columns.findIndex((c) => c.id === stickyColumnId)
      : -1;

  return (
    <div
      className={cn(
        "standard-table-wrapper h-full w-full flex flex-col min-h-0 overflow-hidden",
        dense && "data-table-dense"
      )}
      style={{ isolation: "isolate" }}
    >
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto relative">
        <Table className={cn("w-full", dense && "text-sm")}>
          <TableHeader className={stickyHeader ? "sticky top-0 bg-background z-20" : ""}>
            <TableRow>
              {columns.map((column, colIndex) => {
                const isStickyLeft = stickyLeftColumnIds.includes(column.id);
                const isStickyRight = isStickyRightCol(column.id);
                const stickyRightOffset = isStickyRight
                  ? getStickyRightOffset(column.id) ?? 0
                  : undefined;
                const isBeforeStickyRight =
                  leftmostStickyRightIndex > 0 && colIndex === leftmostStickyRightIndex - 1;

                let leftOffset = 0;
                if (isStickyLeft) {
                  const stickyIndex = stickyLeftColumnIds.indexOf(column.id);
                  if (stickyIndex > 0) {
                    for (let i = 0; i < stickyIndex; i++) {
                      const prevStickyId = stickyLeftColumnIds[i];
                      const prevColumn = columns.find((col) => col.id === prevStickyId);
                      if (prevColumn?.width) {
                        const match = prevColumn.width.match(/w-\[(\d+)px\]|w-(\d+)/);
                        leftOffset += match
                          ? parseInt(match[1] || match[2] || "150", 10)
                          : 150;
                      } else {
                        leftOffset += 150;
                      }
                    }
                  }
                }

                return (
                  <DraggableTableHead
                    key={column.id}
                    columnId={column.id}
                    isDragging={draggedColumn === column.id}
                    sortable={column.sortable !== false}
                    sortDirection={
                      sortState.columnId === column.id ? sortState.direction : null
                    }
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    onSort={handleSort}
                    className={cn(
                      column.width,
                      isBeforeStickyRight && "border-r-0",
                      dense && "!h-7 !py-1 !text-xs"
                    )}
                    sticky={isStickyRight}
                    stickyRightOffset={stickyRightOffset}
                    stickyLeft={isStickyLeft}
                    stickyLeftOffset={isStickyLeft ? leftOffset : undefined}
                    align={column.align}
                  >
                    {column.label}
                  </DraggableTableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child_td]:pb-4">
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <TableRow
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    dense && "data-table-dense-row"
                  )}
                >
                  {columns.map((column, colIndex) => {
                    const alignClass =
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : "text-left";

                    const isStickyLeft = stickyLeftColumnIds.includes(column.id);
                    const isStickyRight = isStickyRightCol(column.id);
                    const stickyRightOffset = isStickyRight
                      ? getStickyRightOffset(column.id) ?? 0
                      : undefined;
                    const isBeforeStickyRight =
                      leftmostStickyRightIndex > 0 &&
                      colIndex === leftmostStickyRightIndex - 1;

                    let leftOffset = 0;
                    if (isStickyLeft) {
                      const stickyIndex = stickyLeftColumnIds.indexOf(column.id);
                      if (stickyIndex > 0) {
                        for (let i = 0; i < stickyIndex; i++) {
                          const prevStickyId = stickyLeftColumnIds[i];
                          const prevColumn = columns.find((col) => col.id === prevStickyId);
                          if (prevColumn?.width) {
                            const match = prevColumn.width.match(/w-\[(\d+)px\]|w-(\d+)/);
                            leftOffset += match
                              ? parseInt(match[1] || match[2] || "150", 10)
                              : 150;
                          } else {
                            leftOffset += 150;
                          }
                        }
                      }
                    }

                    return (
                      <TableCell
                        key={column.id}
                        className={cn(
                          alignClass,
                          isStickyRight &&
                            "sticky z-10 min-w-[180px] bg-surface-elevated sticky-col-shadow-fixed",
                          isStickyLeft &&
                            "sticky bg-background z-10 shadow-[inset_1px_0_0_0_var(--color-border-default)]",
                          isBeforeStickyRight && "border-r-0",
                          dense &&
                            "py-1 px-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis",
                          getCellClassName?.(column.id)
                        )}
                        style={
                          isStickyLeft
                            ? {
                                left: `${leftOffset}px`,
                                position: "sticky" as const,
                                zIndex: 10,
                              }
                            : isStickyRight
                              ? {
                                  right: `${stickyRightOffset ?? 0}px`,
                                  position: "sticky" as const,
                                  zIndex: 10,
                                }
                              : undefined
                        }
                      >
                        {(() => {
                          const cell = renderCell(item, column.id);
                          if (
                            cell !== null &&
                            cell !== undefined &&
                            typeof cell === "object" &&
                            !Array.isArray(cell) &&
                            !isValidElement(cell)
                          ) {
                            try {
                              return JSON.stringify(cell);
                            } catch {
                              return String(cell);
                            }
                          }
                          if (typeof cell === "function") return String(cell);
                          return cell;
                        })()}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={cn(
                    "py-8 text-muted-foreground px-4",
                    centerEmptyMessage ? "text-center" : "text-left"
                  )}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
