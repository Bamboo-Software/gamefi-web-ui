/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    title: string;
    width?: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
  }[];
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  renderActions?: (item: T) => React.ReactNode;
  sortConfig: {
    key: string;
    direction: "ascending" | "descending";
  } | null;
  onSort: (key: string) => void;
  selectedItemsActions?: React.ReactNode;
  totalItems?: number;
  totalPages?: number;
  onItemsPerPageChange?: (value: number) => void;
  isLoading?: boolean;
  skeletonRowCount?: number;
  
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onRowSelect?: (id: string | number, selected: boolean) => void;
  rowIdentifier?: keyof T | ((item: T) => string | number);
  onRowClick?: (item: T) => void;
  rowHoverEffect?: boolean;
  stickyHeader?: boolean;
  stripedRows?: boolean;

}

export function DataTable<T>({
  data,
  columns,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  renderActions,
  sortConfig,
  onSort,
  totalItems,
  totalPages: propsTotalPages,
  isLoading = false,
  skeletonRowCount = 5,
  onRowClick,
  rowHoverEffect = false,
  onItemsPerPageChange,
  stickyHeader = false,
  stripedRows = false,

}: DataTableProps<T>) {
  const totalPages = propsTotalPages || Math.ceil((totalItems || data.length) / itemsPerPage);
  
  const currentItems = data;

  return (
    <>
      <div className={cn("rounded-md border", stickyHeader && "max-h-[600px] overflow-auto")}>
        <Table >
          
          <TableHeader className={cn(" rounded-full", stickyHeader && "sticky top-0 z-10")}>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`font-semibold ${column.width ? column.width : ""} ${
                    column.sortable ? "cursor-pointer" : ""
                  }`}
                  onClick={() => column.sortable && onSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <>
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === "ascending" ? (
                            <ArrowUp className="inline h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDown className="inline h-4 w-4 ml-1" />
                          )
                        ) : (
                          <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        )}
                      </>
                    )}
                  </div>
                </TableHead>
              ))}
              {renderActions && (
                <TableHead className="font-semibold text-right">Thao tác</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={`${column.key}-skeleton`}>
                      <Skeleton className="h-6 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell className="text-right">
                      <Skeleton className="h-6 w-16 ml-auto" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <TableRow key={index} className={cn(
                  rowHoverEffect && "hover:bg-muted/50 transition-colors",
                  stripedRows && index % 2 === 1 ? "bg-muted/50" : "",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick && onRowClick(item)}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item)
                        : (item as any)[column.key]}
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell className="text-right">
                      {renderActions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderActions ? 2 : 1)}
                  className="h-24 text-center"
                >
                  Không tìm thấy dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="my-4 flex flex-row justify-between items-center">
          {onItemsPerPageChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50, 100].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">items</span>
            </div>
          )}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    cn(
                      currentPage === 1 ? "pointer-events-none opacity-50" : "",
                      "rounded-full text-[#328E6E]"
                    )
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNumber;

                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                  if (i === 4)
                    return (
                      <PaginationItem key={i}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                  if (i === 0)
                    return (
                      <PaginationItem key={i}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                } else {
                  if (i === 0)
                    return (
                      <PaginationItem key={i}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  if (i === 4)
                    return (
                      <PaginationItem key={i}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  pageNumber = currentPage - 1 + i;
                }

                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`${ currentPage === pageNumber ? 'bg-[#328E6E] text-gray-50' : 'bg-[#E1EEBC] text-[#328E6E]'} cursor-pointer mx-1.5 border-none rounded-full`}

                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                      cn(
                        currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "",
                        "rounded-full text-[#328E6E]"
                      )
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
     )} 
    </>
  );
}