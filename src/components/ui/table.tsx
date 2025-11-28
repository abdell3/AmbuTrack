import * as React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto -mx-4 sm:mx-0">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-2 sm:px-4 text-left align-middle font-medium text-muted-foreground text-xs sm:text-sm [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-2 sm:p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export type SortDirection = "asc" | "desc" | null

export interface SortableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: SortableColumn<T>[]
  sortKey?: keyof T | string
  sortDirection?: SortDirection
  onSort?: (key: keyof T | string, direction: SortDirection) => void
  filterValue?: string
  onFilterChange?: (value: string) => void
  filterPlaceholder?: string
  loading?: boolean
  error?: string
  emptyMessage?: string
  className?: string
  ariaLabel?: string
}

function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  sortKey,
  sortDirection,
  onSort,
  filterValue,
  onFilterChange,
  filterPlaceholder = "Rechercher...",
  loading = false,
  error,
  emptyMessage = "Aucune donnée disponible",
  className,
  ariaLabel = "Table de données",
}: TableProps<T>) {
  const handleSort = (columnKey: keyof T | string) => {
    if (!onSort) return

    const column = columns.find((col) => col.key === columnKey)
    if (!column || column.sortable === false) return

    let newDirection: SortDirection = "asc"
    if (sortKey === columnKey && sortDirection === "asc") {
      newDirection = "desc"
    } else if (sortKey === columnKey && sortDirection === "desc") {
      newDirection = null
    }

    onSort(columnKey, newDirection)
  }

  const getSortIcon = (columnKey: keyof T | string) => {
    if (sortKey !== columnKey || !sortDirection) {
      return <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" aria-hidden="true" />
    }
    return <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
  }

  if (error) {
    return (
      <div
        className={cn("rounded-md border border-destructive p-4", className)}
        role="alert"
        aria-live="polite"
      >
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {onFilterChange && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={filterPlaceholder}
            value={filterValue || ""}
            onChange={(e) => onFilterChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background dark:border-input sm:max-w-sm"
            aria-label="Filtrer les données"
          />
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table aria-label={ariaLabel} className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>
                  {column.sortable !== false && onSort ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-4 hover:bg-transparent"
                      onClick={() => handleSort(column.key)}
                      aria-label={`Trier par ${column.label} ${
                        sortKey === column.key && sortDirection === "asc"
                          ? "croissant"
                          : sortKey === column.key && sortDirection === "desc"
                          ? "décroissant"
                          : ""
                      }`}
                    >
                      {column.label}
                      {getSortIcon(column.key)}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                  aria-busy="true"
                >
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Chargement...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => {
                    const value = row[column.key as keyof T]
                    return (
                      <TableCell key={String(column.key)}>
                        {column.render
                          ? column.render(value, row)
                          : String(value ?? "")}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  DataTable,
}

