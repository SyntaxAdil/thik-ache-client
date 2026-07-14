// components/shared/table-pagination.tsx
"use client";

import React, { useState } from "react";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface ReusableTablePaginationProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function ReusableTablePagination<T>({
  data,
  columns,
  pageSize = 5,
  emptyMessage = "No data available.",
  onRowClick,
  className = "",
}: ReusableTablePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderCellContent = (row: T, column: Column<T>) => {
    if (column.render) {
      return column.render(row);
    }
    if (column.accessorKey) {
      return row[column.accessorKey] as React.ReactNode;
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-zinc-950/40 border border-zinc-900 p-12 text-center">
        <p className="text-zinc-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className="rounded-2xl bg-zinc-950/40 border border-zinc-900 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-950 border-b border-zinc-900">
            <TableRow className="hover:bg-transparent border-b border-zinc-900">
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={`text-2xs font-bold uppercase tracking-wider text-zinc-500 py-4 first:pl-6 last:pr-6 ${col.className || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={`border-b border-zinc-900/60 hover:bg-zinc-950/60 last:border-0 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, colIdx) => (
                  <TableCell
                    key={colIdx}
                    className="text-xs text-zinc-300 py-4 first:pl-6 last:pr-6 font-medium"
                  >
                    {renderCellContent(row, col)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={`text-2xs rounded-xl border-zinc-900 transition-all ${
                    currentPage === 1
                      ? "pointer-events-none opacity-40 bg-transparent text-zinc-600"
                      : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                    className={`text-2xs h-9 w-9 rounded-xl border transition-all ${
                      currentPage === i + 1
                        ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500"
                        : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={`text-2xs rounded-xl border-zinc-900 transition-all ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40 bg-transparent text-zinc-600"
                      : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}