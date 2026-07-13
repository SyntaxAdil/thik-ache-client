"use client"

import React, { useState } from "react"
import { Star, ShieldCheck, MapPin } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface MemberLog {
  id: string;
  name: string;
  role: string;
  location: string;
  completedTasks: number;
  rating: number;
  latestReview: {
    reviewer: string;
    comment: string;
  };
}

interface TablePaginationProps {
  data: MemberLog[];
  pageSize?: number;
}

export default function TablePagination({ data, pageSize = 5 }: TablePaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  // Define column layout entirely within client boundaries
  const columns = [
    {
      header: "Verified Operator",
      render: (row: MemberLog) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer">{row.name}</span>
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          </div>
          <p className="text-2xs text-zinc-500 font-medium">{row.role}</p>
        </div>
      ),
    },
    {
      header: "Grid Coordinates",
      render: (row: MemberLog) => (
        <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
          <MapPin className="h-3 w-3 text-zinc-600 shrink-0" />
          <span>{row.location}</span>
        </div>
      ),
    },
    {
      header: "Trust Output",
      render: (row: MemberLog) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="h-3 w-3 fill-current shrink-0" />
            <span>{row.rating.toFixed(2)}</span>
          </div>
          <p className="text-2xs text-zinc-500 font-semibold uppercase tracking-wider">{row.completedTasks} Tasks Done</p>
        </div>
      ),
    },
    {
      header: "Reciprocal Peer Review Matrix",
      render: (row: MemberLog) => (
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-900/60 space-y-1 max-w-sm sm:max-w-md">
          <p className="text-2xs text-zinc-400 leading-relaxed italic">
            &quot;{row.latestReview.comment}&quot;
          </p>
          <div className="flex items-center gap-1 text-2xs text-zinc-600 font-mono font-bold">
            <span>— via</span>
            <span className="text-zinc-500">{row.latestReview.reviewer}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="rounded-2xl bg-zinc-950/40 border border-zinc-900 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-950 border-b border-zinc-900">
            <TableRow className="hover:bg-transparent border-b border-zinc-900">
              {columns.map((col, idx) => (
                <TableHead 
                  key={idx} 
                  className="text-2xs font-bold uppercase tracking-wider text-zinc-500 py-4 first:pl-6 last:pr-6"
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIdx) => (
                <TableRow 
                  key={rowIdx} 
                  className="border-b border-zinc-900/60 hover:bg-zinc-950/60 last:border-0 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <TableCell 
                      key={colIdx} 
                      className="text-xs text-zinc-300 py-4 first:pl-6 last:pr-6 font-medium"
                    >
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-zinc-600 text-xs">
                  No community logs registered.
                </TableCell>
              </TableRow>
            )}
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
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                      setCurrentPage(i + 1);
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
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
  )
}